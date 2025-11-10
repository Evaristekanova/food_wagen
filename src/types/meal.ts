export interface Meal {
  id: string;
  name: string;
  restaurantName: string;
  avatar: string;
  logo: string;
  image: string;
  rating: number;
  open: boolean;
  status: "Open" | "Closed";
  Price: string;
  createdAt: string;
}
