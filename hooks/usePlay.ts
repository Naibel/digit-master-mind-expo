const usePlay = () => {
  const play = (attempt: string, choosen: string) => {
    let bulls = 0;
    let cows = 0;

    for (let i = 0; i < choosen.toString().length; i++) {
      if (attempt.toString().charAt(i) === choosen.toString().charAt(i)) {
        cows++;
      } else if (
        attempt.toString().indexOf(choosen.toString().charAt(i)) > -1
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
