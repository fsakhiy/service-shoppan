import { IsNotEmpty } from 'class-validator';

class OpenShopDto {
  @IsNotEmpty()
  name: string;
}

export { OpenShopDto };
