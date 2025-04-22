import { useState, useEffect } from "react";

/*
pb:
     We need in this fetch hook to support different methods and body,
in order to make it more flexible and reusable.

solution:
    Add a second parameter to the hook named options by conventions.
    Pass that options object directly to the fetch() call

conclusion:
    This allows to customize the HTTP methos, headers, body, etc... 
    wihout changing the hook itself every time.

note: 
    why we stringify options in the dependency array?
        When use objects like options in React's useEffect dependency array, React check
        whether the object reference has changed between renders. But objects in JS are 
        reference types. Means even if the object is the same, React might detect it as a new
        object because the reference has changed
solution:
    1.stringify options to compare content: which is a primitive type. React can then easily
    compare it between renders since strings are compared by value, not by reference.
    2.Instead on relying on JSON.stringify(options) which is not recommended. not ideal for
     complex objects due to performance and potential inconsistencies. Use useMemo to 
    memorize the options object:
    useMemo ensures the object reference is stable across renders unless its dependencies change.
    This avoids unecessary stringifying.

solution 2 : TO AVOID JSON.stringify(options) which send an error!!!!!!!!!!!!!
     not ideal for complex objects due to performance and potential inconsistencies.
    Use a custom "trigger" or flag
    const trigger = JSON.stringify(dataToPost);
    useFetch('/api/post', options, trigger);
 */
export const useFetch = (url, options) => {
  const [data, setData] = useState({});
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // check if url is valid if not skip fetching
    if (!url) return;

    setIsLoading(true); // Set loading to true on each fetch
    setError(null); // Reset error before a new fetch

    fetch(url, options)
      .then((res) => {
        if (!res.ok) {
          console.error("Network response problem!", res);
          setError("Failed to fetch data");
          return; // Simply return without proceeding further
        }
        res.json(); // reads the body of the response and parses it as JSON.
      })
      .then((data) => {
        setData(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Something went wrong");
        setIsLoading(false);
      });
  }, [url, options]);
  return { isLoading, data, error };
};
