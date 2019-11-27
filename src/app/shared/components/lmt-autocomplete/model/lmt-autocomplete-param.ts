import { Observable } from 'rxjs';

/**
 * Model that describe the input of LMT Autocomplete component
 */
export interface LmtAutocompleteParameter {
    datasource:             Observable<any[]>;
    attributeNameToDisplay: string;             // what to display for user
    attributeNameForFilter: string;             // attribute used for filtering and autocomplete
    attributeNameKey:       string;             // attribute value that will be returned to parent, id ?
};
