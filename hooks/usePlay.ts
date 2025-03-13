const usePlay = () => {
  const play = (attempt: string, chosenNumber: string) => {
    let bulls = 0;
    let cows = 0;

    for (let i = 0; i < chosenNumber.toString().length; i++) {
      if (attempt.toString().charAt(i) === chosenNumber.toString().charAt(i)) {
        cows++;
      } else if (
        attempt.toString().indexOf(chosenNumber.toString().charAt(i)) > -1
      ) {
        bulls++;
      }
    }

    return {
      bulls,
      cows,
    };
  };

  return { play };
};

export default usePlay;
