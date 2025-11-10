const Loader = () => {
  return (
    <div className="flex justify-center items-center h-40">
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ubuGreenDark dark:border-ubuDarkModeGoldDark mb-4"></div>
        <p className="text-gray-600 text-base font-centuryGothic dark:text-ubuDarkModeStrongGray font-medium">
          Loading...
        </p>
      </div>
    </div>
  );
};

export default Loader;
