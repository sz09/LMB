export class Province {
  Id: string | null = null;
  Name!: string;
  Districts!: District[];
}

export class District {
  Id: string | null = null;
  Name!: string;
  Wards!: Ward[];
}

export class Ward {
  Id: string | null = null;
  Name!: string;
  Level!: string;
}
