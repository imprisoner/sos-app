import { OAuth2Client } from 'google-auth-library'
import { OAuthStrategy } from '@feathersjs/authentication-oauth'
import { _ } from '@feathersjs/commons'
import { enums } from '../../constants/databaseTypes.js'

const client = new OAuth2Client();

export class GoogleStrategy extends OAuthStrategy {
  async getProfile(data, params) {
    const profile = await this.verify(data)
    return profile
  }

  async verify(data) {
    const ticket = await client.verifyIdToken({
      idToken: data.accessToken,
      audience: data.client_id
    });

    const payload = ticket.getPayload();
    payload.role = data.role

    return payload
  }

  async getEntityData(profile) {
    const preferredLang = enums.userPreferredLang.includes(profile.locale) ? profile.locale : 'en'

    return {
      email: profile.email,
      avatar: profile.picture,
      name: profile.given_name + ' ' + profile.family_name,
      role: profile.role,
      rememberMe: true,
      preferredLang
    };
  }

  async createAccountProviderEntity(userId, profile, params) {
    const data = {
      userId,
      provider: this.name,
      profileId: profile.sub,
      email: profile.email,
    }

    await this.app.service('account-providers').create(data, _.omit(params, 'query'))
  }

  async getEntityQuery(profile) {
    const query = { email: profile.email }

    return query
  }

  async authenticate(authentication, originalParams) {
    const entity = this.configuration.entity
    const { provider, ...params } = originalParams
    const profile = await this.getProfile(authentication, params)

    const existingEntity = await this.findEntity(profile, params)

    const authEntity = !existingEntity
      ? await this.createEntity(profile, params)
      : await this.updateEntity(existingEntity, profile, params)

    return {
      authentication: { strategy: this.name },
      [entity]: await this.getEntity(authEntity, originalParams)
    }
  }

  async findEntity(profile, params) {
    const query = await this.getEntityQuery(profile, params);

    const { data } = await this.entityService.find({
      ...params,
      query
    });


    const [entity = null] = data
    return entity;
  }

  async createEntity(profile, params) {
    const data = await this.getEntityData(profile);

    const entity = await this.entityService.create(data, _.omit(params, 'query'));

    await this.createAccountProviderEntity(entity.id, profile, params)

    return entity
  }

  async updateEntity(entity, profile, params) {
    const userId = entity[this.entityId];
    const data = await this.getEntityData(profile, entity, params);
    const accountProvider = await this.findAccountProviderEntity(profile)

    if(!accountProvider) {
      await this.createAccountProviderEntity(userId, profile, null)
      return this.entityService.patch(userId, data, _.omit(params, 'query'));
    }
    
    return entity
  }

  async findAccountProviderEntity(profile) {
    const accountProviderQuery = {
      profileId: profile.sub || profile.id,
      provider: this.name
    }

    const { data } = await this.app.service('account-providers').find({
      query: accountProviderQuery
    })

    if (!data.length) {
      return null
    }

    return data[0]
  }
}