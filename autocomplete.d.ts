declare module "@trevoreyre/autocomplete-js" {
  type AutocompleteJsOptions = {
    search(input: string): object | Promise<object>;
    onSubmit(result: object): void;
    debounceTime?: number;
  };

  export default class Autocomplete {
    constructor(inputSelector: string, options?: AutocompleteJsOptions);
    options: AutocompleteJsOptions;
    destroy(): void;
  }
}
