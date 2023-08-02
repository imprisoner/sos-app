export const setupTimeout = (context, next) => {
  if(context.data.resultConditionRate >= 0) {
    return context
  }

  if (context?.data?.isActive === undefined) {
    const data = {
      roomId: context.id
    }
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(context.service.timeout(data))
      }, 15000)
    })
  }
}