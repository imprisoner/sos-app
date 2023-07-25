export const setupTimeout = (context, next) => {
  if (context?.data?.isActive === undefined) {
    const data = {
      roomId: context.id
    }
    console.log('Setup timeout')
    setTimeout(() => {
      context.service.timeout(data)
    }, 15000)
  }
}