export class CreateQuantityDto {
  amount: number;
  ingredient: { id: string };
  recipe: { id: number };
}
