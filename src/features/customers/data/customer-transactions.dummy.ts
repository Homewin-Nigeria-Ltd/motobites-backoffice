import type { CustomerDetail, CustomerTransaction } from "../types"

const REVIEW_TEXT =
  "The culinary experience was nothing short of extraordinary as every dish served showcased an exquisite fusion of flavors and textures that delighted the palate. The sheer delectability of the food left an indelible mark, a testament to the culinary prowess employed in its creation."

function buildTransaction(
  id: string,
  orderNumber: string,
  customerName: string
): CustomerTransaction {
  return {
    id,
    orderNumber,
    referenceNumber: orderNumber.replace("Order ", ""),
    mealName: "Jollof Rice and Chicken",
    itemImage: null,
    amountPaid: "2,800",
    customerName,
    deliveryAddress: "14B Milverton Road, Ikoyi, Lagos, Nigeria",
    status: "delivered",
    displayStatus: "Delivered",
    riderName: "Oluwatobi Oluwanifemi",
    customerRemark: "😍",
    orderedAt: "Sunday, March 23rd 2024 - 9:30am",
    paymentMethod: "Flutterwave Online Method",
    deliveryTime: "2:43 PM",
    customerReview: REVIEW_TEXT,
    riderReview: REVIEW_TEXT,
    kitchen: null,
  }
}

export function getDummyCustomerTransactions(
  customer?: Pick<CustomerDetail, "name" | "firstName" | "lastName">
): CustomerTransaction[] {
  const customerName =
    customer?.name ||
    [customer?.firstName, customer?.lastName].filter(Boolean).join(" ") ||
    "Oluwanifemi Osunsanya"

  return [
    buildTransaction("dummy-1", "Order 330215", customerName),
    buildTransaction("dummy-2", "Order 330214", customerName),
    buildTransaction("dummy-3", "Order 330213", customerName),
  ]
}
