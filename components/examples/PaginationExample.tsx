'use client';

import { useState } from 'react';
import { DataPagination, PaginationMeta } from '@/components/ui/DataPagination';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// Sample data for demonstration
const dummyData = Array.from({ length: 97 }, (_, i) => ({
  id: i + 1,
  name: `Item ${i + 1}`,
  description: `Description for item ${i + 1}`,
}));

export function PaginationExample() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Calculate pagination metadata
  const totalItems = dummyData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const pagination: PaginationMeta = {
    page: currentPage,
    limit: itemsPerPage,
    totalCount: totalItems,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  };

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = dummyData.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // You might want to scroll to top here
    window.scrollTo(0, 0);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (newLimit: number) => {
    setItemsPerPage(newLimit);
    setCurrentPage(1); // Reset to first page when changing limit
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Client-Side Pagination Example</CardTitle>
        <CardDescription>
          Demonstrating DataPagination with client-side data
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-end space-x-2">
            <select
              className="border rounded p-1"
              value={itemsPerPage}
              onChange={e => handleItemsPerPageChange(Number(e.target.value))}
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>

          <div className="border rounded-md divide-y">
            {currentItems.map(item => (
              <div key={item.id} className="p-4">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <DataPagination
          pagination={pagination}
          itemName="items"
          onPageChange={handlePageChange}
          showFirstLast={true}
        />
      </CardFooter>
    </Card>
  );
}
