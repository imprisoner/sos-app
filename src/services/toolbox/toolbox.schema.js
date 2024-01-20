// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const toolboxSchema = Type.Object(
  {
  },
  { $id: 'Toolbox', additionalProperties: false }
)
export const toolboxValidator = getValidator(toolboxSchema, dataValidator)
export const toolboxResolver = resolve({})

export const toolboxExternalResolver = resolve({})

// Schema for creating new entries
export const toolboxDataSchema = Type.Pick(toolboxSchema, [], {
  $id: 'ToolboxData'
})
export const toolboxDataValidator = getValidator(toolboxDataSchema, dataValidator)
export const toolboxDataResolver = resolve({})

// Schema for updating existing entries
export const toolboxPatchSchema = Type.Partial(toolboxSchema, {
  $id: 'ToolboxPatch'
})
export const toolboxPatchValidator = getValidator(toolboxPatchSchema, dataValidator)
export const toolboxPatchResolver = resolve({})

// Schema for allowed query properties
export const toolboxQueryProperties = Type.Pick(toolboxSchema, [])
export const toolboxQuerySchema = Type.Intersect(
  [
    querySyntax(toolboxQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export const toolboxQueryValidator = getValidator(toolboxQuerySchema, queryValidator)
export const toolboxQueryResolver = resolve({})
