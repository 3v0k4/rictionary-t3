import { useState, useRef, useEffect } from "react";
import Autocomplete from "@trevoreyre/autocomplete-js";

export const Form = ({
  query: initialQuery,
  klass,
}: {
  query: string;
  klass: string;
}) => {
  const [query, setQuery] = useState(initialQuery);
  const queryRef = useRef<HTMLInputElement>(null);
  const clearSearch = () => {
    setQuery("");
    const element = queryRef.current;
    if (!element) return;
    element.focus();
  };

  useEffect(() => {
    const search = (input: string) =>
      input.length === 0
        ? Promise.resolve([])
        : fetch(`api/suggestions?query=${encodeURIComponent(input)}`).then(
            (response) => response.json()
          );
    const onSubmit = () => document.getElementsByTagName("form")[0]?.submit();
    const debounceTime = 300;
    const autocomplete = new Autocomplete("#search__container", {
      search,
      onSubmit,
      debounceTime,
    });
    return () => {
      autocomplete.destroy();
    };
  }, []);

  useEffect(() => {
    const callback = (event: KeyboardEvent) => {
      const element = queryRef.current;
      if (!element) return;
      if (event.key !== "f") {
        return;
      }
      if (document.activeElement !== document.getElementsByTagName("body")[0]) {
        return;
      }
      element.select();
      event.preventDefault();
    };
    document.addEventListener("keypress", callback);
    return () => {
      document.removeEventListener("keypress", callback);
    };
  }, []);

  return (
    <form
      action="/"
      id="search__container"
      className={`search__container ${klass}`}
    >
      <label htmlFor="query" className="hidden">
        Word in any language
      </label>

      <input
        type="text"
        placeholder="word in any language"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="search__input"
        id="search__input"
        name="query"
        ref={queryRef}
      />

      {query.length === 0 ? null : (
        <button
          id="search__clear"
          className="search__clear"
          type="button"
          aria-label="clear query"
          onClick={clearSearch}
        >
          <i>
            <svg
              className="search__icon"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              xmlSpace="preserve"
              version="1.1"
              viewBox="0 0 847 847"
              x="0px"
              y="0px"
              fillRule="evenodd"
              clipRule="evenodd"
            >
              <g>
                <path
                  className="fil0"
                  d="M423 12c227,0 412,184 412,411 0,227 -185,412 -412,412 -227,0 -411,-185 -411,-412 0,-227 184,-411 411,-411zm0 469l-148 149c-38,38 -96,-20 -58,-58l148 -149 -148 -148c-38,-38 20,-96 58,-58l148 148 149 -148c38,-38 96,20 58,58l-149 148 149 149c38,38 -20,96 -58,58l-149 -149zm0 -449c-216,0 -391,175 -391,391 0,216 175,392 391,392 216,0 392,-176 392,-392 0,-216 -176,-391 -392,-391z"
                />
              </g>
            </svg>
          </i>
        </button>
      )}

      <ul className="search__result-list"></ul>

      <button
        type="submit"
        id="search__button"
        className="search__button"
        aria-label="search"
      >
        <i>
          <svg
            className="search__icon"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            version="1.1"
            x="0px"
            y="0px"
            viewBox="0 0 100 100"
            xmlSpace="preserve"
          >
            <path d="M87,81.3L69.1,63.4c9-11.7,8.1-28.6-2.7-39.3c-5.9-5.9-13.5-8.8-21.2-8.8s-15.3,2.9-21.2,8.8c-11.7,11.7-11.7,30.7,0,42.4  c5.9,5.9,13.5,8.8,21.2,8.8c6.4,0,12.8-2,18.1-6.1L81.3,87c0.8,0.8,1.8,1.2,2.9,1.2c1,0,2.1-0.4,2.9-1.2  C88.6,85.5,88.6,82.9,87,81.3z M45.3,67.2c-5.9,0-11.3-2.3-15.5-6.4c-8.5-8.5-8.5-22.4,0-31c4.1-4.1,9.6-6.4,15.5-6.4  s11.3,2.3,15.5,6.4s6.4,9.6,6.4,15.5c0,5.9-2.3,11.3-6.4,15.5S51.1,67.2,45.3,67.2z" />
          </svg>
        </i>
      </button>
    </form>
  );
};
