function Loading() {
  return (
    <div className="text-center">
        <div className ="pt-100">
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl"></h1>
      <div
        className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-danger motion-reduce:animate-[spin_1.5s_linear_infinite]"
        role="status"
      >

      </div>
      <p className="mt-6 text-base leading-7 text-gray-600"></p>
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <p className=" mt-4 text-small text-gray-700">
          Loading...
        </p>
      </div>
      </div>
    </div>
  );
}

export default Loading;
