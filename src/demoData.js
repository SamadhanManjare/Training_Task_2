const demoOrders = [
  {
    id: "ord-1001",
    customer: "Alice Johnson",
    product: "MacBook Pro",
    amount: 2499,
    status: "completed",
    date: "2024-01-15T00:00:00.000Z",
    month: "Jan",
  },
  {
    id: "ord-1002",
    customer: "Bob Smith",
    product: "iPhone 15",
    amount: 999,
    status: "pending",
    date: "2024-02-20T00:00:00.000Z",
    month: "Feb",
  },
  {
    id: "ord-1003",
    customer: "Carol White",
    product: "AirPods Pro",
    amount: 249,
    status: "completed",
    date: "2024-03-10T00:00:00.000Z",
    month: "Mar",
  },
  {
    id: "ord-1004",
    customer: "David Lee",
    product: "iPad Air",
    amount: 749,
    status: "shipped",
    date: "2024-04-05T00:00:00.000Z",
    month: "Apr",
  },
  {
    id: "ord-1005",
    customer: "Eve Martin",
    product: "Apple Watch",
    amount: 399,
    status: "pending",
    date: "2024-05-18T00:00:00.000Z",
    month: "May",
  },
  {
    id: "ord-1006",
    customer: "Frank Brown",
    product: "Mac Mini",
    amount: 699,
    status: "completed",
    date: "2024-06-22T00:00:00.000Z",
    month: "Jun",
  },
  {
    id: "ord-1007",
    customer: "Grace Kim",
    product: "MacBook Air",
    amount: 1299,
    status: "shipped",
    date: "2024-06-30T00:00:00.000Z",
    month: "Jun",
  },
  {
    id: "ord-1008",
    customer: "Henry Wilson",
    product: "iPhone 15",
    amount: 999,
    status: "completed",
    date: "2024-05-11T00:00:00.000Z",
    month: "May",
  },
  {
    id: "ord-1009",
    customer: "Isla Scott",
    product: "iPad Pro",
    amount: 1099,
    status: "completed",
    date: "2024-04-19T00:00:00.000Z",
    month: "Apr",
  },
  {
    id: "ord-1010",
    customer: "James Carter",
    product: "Apple Watch",
    amount: 399,
    status: "pending",
    date: "2024-03-28T00:00:00.000Z",
    month: "Mar",
  },
];

export const initialDemoOrders = demoOrders;

export function getDemoOrders() {
  return [...demoOrders];
}

export function filterDemoOrders(query, sourceOrders = demoOrders) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return [...sourceOrders];
  }

  return sourceOrders.filter((order) =>
    [order.customer, order.product, order.status].some((value) =>
      value.toLowerCase().includes(normalizedQuery),
    ),
  );
}

export function getDemoStats(sourceOrders = demoOrders) {
  const totalRevenue = sourceOrders.reduce((sum, order) => sum + order.amount, 0);
  const totalOrders = sourceOrders.length;
  const avgOrder = totalOrders ? Math.round(totalRevenue / totalOrders) : 0;

  return {
    totalRevenue,
    totalOrders,
    avgOrder,
    byStatus: aggregateBy(sourceOrders, "status"),
    salesByMonth: aggregateBy(sourceOrders, "month"),
    topProducts: aggregateRevenueByProduct(sourceOrders),
  };
}

export function getDemoHealth() {
  return { status: "demo" };
}

export function createDemoOrder(data) {
  const now = new Date();

  return {
    id: `ord-${Math.random().toString(36).slice(2, 10)}`,
    customer: data.customer,
    product: data.product,
    amount: data.amount,
    status: data.status,
    date: now.toISOString(),
    month: now.toLocaleString("en-US", { month: "short", timeZone: "UTC" }),
  };
}

function aggregateBy(sourceOrders, field) {
  return Object.entries(
    sourceOrders.reduce((accumulator, order) => {
      const key = order[field];
      accumulator[key] = (accumulator[key] || 0) + 1;
      return accumulator;
    }, {}),
  ).map(([key, docCount]) => ({
    key,
    doc_count: docCount,
  }));
}

function aggregateRevenueByProduct(sourceOrders) {
  return Object.entries(
    sourceOrders.reduce((accumulator, order) => {
      const entry = accumulator[order.product] || { count: 0, revenue: 0 };
      entry.count += 1;
      entry.revenue += order.amount;
      accumulator[order.product] = entry;
      return accumulator;
    }, {}),
  )
    .map(([key, value]) => ({
      key,
      doc_count: value.count,
      revenue: { value: value.revenue },
    }))
    .sort((left, right) => right.revenue.value - left.revenue.value)
    .slice(0, 5);
}
