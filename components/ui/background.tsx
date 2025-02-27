export function Background() {
  return (
    <>
      {/* Background image with overlay */}
      <div className='fixed inset-0 -z-10'>
        <div className='absolute inset-0 bg-black/60' /> {/* Dark overlay */}
        <img
          src='/images/food.jpg'
          alt='Background'
          className='h-full w-full object-cover'
        />
      </div>
    </>
  )
}
