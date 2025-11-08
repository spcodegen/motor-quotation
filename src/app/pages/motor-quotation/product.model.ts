export interface Cover {
  coverName: string;
  coverType: 'textComponent' | 'dropdownComponent' | 'inputComponent';
  coverValueCanEdit: 'yes' | 'no';
  values: any;
  selectedValue?: any;
}

export interface Product {
  productName: string;
  sumInsured: number;
  covers: Cover[];
}
