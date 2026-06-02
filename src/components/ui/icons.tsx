"use client"

import type { ComponentType, SVGAttributes } from "react"
import {
  ArrowRight,
  AtSign,
  BarChart3,
  Bell,
  BookOpen,
  Camera,
  Check,
  ChefHat,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CircleDollarSign,
  ClipboardList,
  Download,
  Ellipsis,
  FileText,
  Filter,
  Flame,
  GripVertical,
  Headphones,
  Heart,
  LayoutDashboard,
  LayoutGrid,
  List,
  Loader2,
  LogOut,
  Mail,
  Menu,
  Minus,
  Moon,
  Music2,
  Package,
  PanelLeft,
  Pencil,
  Play,
  Plus,
  Search,
  Settings,
  Share2,
  Shield,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Star,
  Sun,
  Tag,
  Tags,
  Trash2,
  TrendingUp,
  Truck,
  Upload,
  UserCircle,
  UserPlus,
  Users,
  X,
  type LucideIcon,
  type LucideProps,
} from "lucide-react"

export interface IconProps {
  size?: number
  className?: string
  color?: string
}

type IconComponent = ComponentType<IconProps & SVGAttributes<SVGSVGElement>>

function fromLucide(LucideIcon: LucideIcon): IconComponent {
  return function Icon({ size = 20, className, color, ...props }: IconProps & SVGAttributes<SVGSVGElement>) {
    const lucideProps: LucideProps = { size, className, ...props }
    if (color) lucideProps.color = color
    return <LucideIcon {...lucideProps} />
  }
}

export const Icons = {
  account: fromLucide(UserCircle),
  add: fromLucide(Plus),
  arrowForward: fromLucide(ArrowRight),
  arrowUp: fromLucide(ChevronUp),
  book: fromLucide(BookOpen),
  cart: fromLucide(ShoppingCart),
  check: fromLucide(Check),
  chevronDown: fromLucide(ChevronDown),
  chevronRight: fromLucide(ChevronRight),
  close: fromLucide(X),
  download: fromLucide(Download),
  edit: fromLucide(Pencil),
  expandMore: fromLucide(ChevronDown),
  facebook: fromLucide(Share2),
  favorite: fromLucide(Tags),
  favoriteFilled: fromLucide(Heart),
  fileText: fromLucide(FileText),
  filter: fromLucide(Filter),
  flame: fromLucide(Flame),
  gridView: fromLucide(LayoutGrid),
  group: fromLucide(Users),
  headphones: fromLucide(Headphones),
  heart: fromLucide(Heart),
  instagram: fromLucide(Camera),
  inventory: fromLucide(BarChart3),
  kitchen: fromLucide(ChefHat),
  list: fromLucide(List),
  listAlt: fromLucide(ClipboardList),
  loader: fromLucide(Loader2),
  logout: fromLucide(LogOut),
  mail: fromLucide(Mail),
  menu: fromLucide(Menu),
  moon: fromLucide(Moon),
  moreHorizontal: fromLucide(Ellipsis),
  notifications: fromLucide(Bell),
  orders: fromLucide(ShoppingBag),
  panelLeft: fromLucide(PanelLeft),
  performance: fromLucide(TrendingUp),
  priceTag: fromLucide(Tag),
  remove: fromLucide(Minus),
  revenue: fromLucide(CircleDollarSign),
  search: fromLucide(Search),
  settings: fromLucide(Settings),
  shield: fromLucide(Shield),
  sparkles: fromLucide(Sparkles),
  star: fromLucide(Star),
  sun: fromLucide(Sun),
  tiktok: fromLucide(Music2),
  trash: fromLucide(Trash2),
  truck: fromLucide(Truck),
  upload: fromLucide(Upload),
  userPlus: fromLucide(UserPlus),
  dashboard: fromLucide(LayoutDashboard),
  delivery: fromLucide(Package),
  dragIndicator: fromLucide(GripVertical),
  x: fromLucide(AtSign),
  youtube: fromLucide(Play),
} as const

export type IconName = keyof typeof Icons

export function Icon({
  name,
  size = 20,
  className,
  color,
  ...props
}: { name: IconName } & IconProps & SVGAttributes<SVGSVGElement>) {
  const Component = Icons[name]
  return <Component size={size} className={className} color={color} {...props} />
}
