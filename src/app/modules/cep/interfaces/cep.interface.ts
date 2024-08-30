export interface ICep {
    "cep": string;
    "state": string;
    "city": string;
    "street": string;
    "neighborhood": string;
}


export interface IViaCep {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}