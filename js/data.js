const menuItems = [
  {
    id: 'cs-001',
    name: 'Crêpes Nutella',
    category: 'Crêpes Sucrés',
    price: 14,
    currency: 'dh',
    image: 'assets/images/creep.jpg',
    description:
      'Our signature thin and delicate crêpe, generously filled with warm, silky Nutella and finished for an indulgent artisan bite.',
    extras: [
      { id: 'strawberry', name: 'Add Strawberry', price: 2 },
      { id: 'banana', name: 'Add Banana', price: 1.5 },
      { id: 'extra-nutella', name: 'Extra Nutella', price: 2.5 }
    ]
  },
  {
    id: 'cs-002',
    name: 'Crêpes Pistache Framboise',
    category: 'Crêpes Sucrés',
    price: 18,
    currency: 'dh',
    image: 'assets/images/drin k.jpg',
    description:
      'Silky pistachio cream, fresh raspberries, and a whisper of vanilla sugar layered over feather-light artisan crêpes.',
    extras: [
      { id: 'raspberries', name: 'Extra Framboise', price: 3 },
      { id: 'pistachio', name: 'Pistachio Crunch', price: 2.5 }
    ]
  },
  {
    id: 'bc-001',
    name: 'Cappuccino Signature',
    category: 'Boisson chaude',
    price: 16,
    currency: 'dh',
    image: 'assets/images/creep.jpg',
    description:
      'A velvety espresso-forward cappuccino with microfoam texture and toasted cacao notes, crafted for slow mornings.',
    extras: [
      { id: 'oat-milk', name: 'Oat Milk', price: 2 },
      { id: 'caramel', name: 'Caramel Drizzle', price: 1.5 }
    ]
  },
  {
    id: 'bc-002',
    name: 'Spanish Latte',
    category: 'Boisson chaude',
    price: 19,
    currency: 'dh',
    image: 'assets/images/drin k.jpg',
    description:
      'Double espresso softened with steamed milk and sweet condensed milk for a polished, dessert-like finish.',
    extras: [
      { id: 'cinnamon', name: 'Cinnamon Dust', price: 1 },
      { id: 'vanilla-foam', name: 'Vanilla Foam', price: 2 }
    ]
  },
  {
    id: 'bf-001',
    name: 'Iced Vanilla Latte',
    category: 'Boisson froide',
    price: 22,
    currency: 'dh',
    image: 'assets/images/creep.jpg',
    description:
      'House vanilla, chilled espresso, and creamy milk poured over crystal ice for a clean, elegant refreshment.',
    extras: [
      { id: 'cold-foam', name: 'Cold Foam', price: 2.5 },
      { id: 'espresso-shot', name: 'Extra Espresso', price: 3 }
    ]
  },
  {
    id: 'bf-002',
    name: 'Berry Hibiscus Tonic',
    category: 'Boisson froide',
    price: 20,
    currency: 'dh',
    image: 'assets/images/drin k.jpg',
    description:
      'Bright hibiscus infusion with wild berry reduction and sparkling tonic for a floral, jewel-toned finish.',
    extras: [
      { id: 'mint', name: 'Fresh Mint', price: 1 },
      { id: 'lemon-zest', name: 'Candied Lemon Zest', price: 1.5 }
    ]
  },
  {
    id: 'cl-001',
    name: 'Crêpe Dinde Fromage',
    category: 'Crêpes Salés',
    price: 25,
    currency: 'dh',
    image: 'assets/images/creep.jpg',
    description:
      'A savory artisan crêpe layered with smoked turkey, molten cheese, and a touch of mustard crème.',
    extras: [
      { id: 'egg', name: 'Farm Egg', price: 3 },
      { id: 'cheese', name: 'Extra Fromage', price: 3.5 }
    ]
  },
  {
    id: 'cl-002',
    name: 'Crêpe Saumon Fumé',
    category: 'Crêpes Salés',
    price: 31,
    currency: 'dh',
    image: 'assets/images/drin k.jpg',
    description:
      'Smoked salmon, dill crème fraîche, capers, and delicate greens wrapped in a warm buckwheat crêpe.',
    extras: [
      { id: 'avocado', name: 'Avocado Slices', price: 4 },
      { id: 'microgreens', name: 'Microgreens', price: 2 }
    ]
  },
  {
    id: 'gw-001',
    name: 'Gouffre Praliné Noisette',
    category: 'Gouffre',
    price: 24,
    currency: 'dh',
    image: 'assets/images/creep.jpg',
    description:
      'Golden waffle finished with hazelnut praline, roasted nuts, and a satin chocolate ribbon.',
    extras: [
      { id: 'ice-cream', name: 'Vanilla Ice Cream', price: 4 },
      { id: 'hazelnut', name: 'Roasted Hazelnuts', price: 2 }
    ]
  },
  {
    id: 'gw-002',
    name: 'Gouffre Fruits Rouges',
    category: 'Gouffre',
    price: 23,
    currency: 'dh',
    image: 'assets/images/drin k.jpg',
    description:
      'Crisp Belgian-style waffle topped with macerated berries, vanilla cream, and a velvet berry glaze.',
    extras: [
      { id: 'whipped-cream', name: 'Whipped Cream', price: 2 },
      { id: 'berry-compote', name: 'Extra Berry Compote', price: 2.5 }
    ]
  }
];

const menuCategories = ['All', 'Boisson chaude', 'Boisson froide', 'Crêpes Sucrés', 'Crêpes Salés', 'Gouffre'];
