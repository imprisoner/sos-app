export const setupTimeout = (context, next) => {
  if(context.data.resultConditionRate >= 0) {
    return context
  }
  console.log('Setting up timer at room ' + context.id)
  if (context?.data?.isActive === undefined) {
    const data = {
      roomId: context.id
    }
    setTimeout(() => {
      context.service.timeout(data)
    }, 15000)
  }
}