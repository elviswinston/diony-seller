import { useState } from "react";

const useLoading = () => {
  const [isLoading, setIsLoading] = useState(false);

  const onLoading = () => {
    setIsLoading(true);
  };

  const offLoading = () => {
    setIsLoading(false);
  };

  return { isLoading, onLoading, offLoading };
};

export default useLoading;
