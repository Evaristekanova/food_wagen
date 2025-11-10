export interface Meal {
  id: string;
  name: string;
  restaurantName: string | Restaurant;
  avatar: string;
  logo: string;
  image: string;
  rating: number;
  open: boolean;
  status: "Open" | "Closed";
  Price: string;
  createdAt: string;
}

export interface Restaurant {
  name: string;
  logo: string;
  status: string;
}
