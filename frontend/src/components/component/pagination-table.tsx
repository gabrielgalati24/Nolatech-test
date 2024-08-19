import { Button } from "@/components/ui/button";

export function Pagination({ currentPage, totalPages, handlePreviousPage, handleNextPage }:any) {
  return (
    <div className="flex justify-between items-center mt-4">
      <Button onClick={handlePreviousPage} disabled={currentPage === 1}>
        Previous
      </Button>
      <span>Page {currentPage} of {totalPages}</span>
      <Button onClick={handleNextPage} disabled={currentPage === totalPages}>
        Next
      </Button>
    </div>
  );
}
