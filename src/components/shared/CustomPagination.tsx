"use client"
import { ArrowBigLeft, ArrowBigRight } from 'lucide-react';
import { Button } from '../ui/button';
import { useState } from 'react';

const CustomPagination = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const total = 5;

  const handleNext = () =>{
    if (currentPage < total) {
      setCurrentPage(currentPage + 1);
    }
  }
  const handlePrevious = () =>{
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  return (
    <div className='flex justify-center items-center gap-4'>
      <Button className='w-auto' onClick={handlePrevious}>
        <ArrowBigLeft />
      </Button>

      <div className='flex gap-1 items-center'>
        {Array.from({ length: total }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            className={`w-auto bg-white/10 backdrop-blur-sm border rounded-xl shadow-lg px-4 py-2 ${page === currentPage ? "border-2 border-global-border text-white" : "border-white/10 text-subheading"}`}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        ))}
      </div>

      <Button className='w-auto' onClick={handleNext}>
        <ArrowBigRight />
      </Button>
    </div>
  )
}

export default CustomPagination;