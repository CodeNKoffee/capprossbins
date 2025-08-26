// "use client"
// import React, { useState } from 'react'
// import { motion } from 'framer-motion'
// import { useBinning } from '../../hooks/useBinning'

// export default function BinningDashboard() {
//   const [csvData, setCsvData] = useState<number[]>([])
//   const [binCount, setBinCount] = useState(10)
//   const [method, setMethod] = useState<'equal_width' | 'quantile'>('equal_width')
//   const { createBinning, result, loading, error } = useBinning()

//   const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0]
//     if (!file) return

//     const reader = new FileReader()
//     reader.onload = (e) => {
//       const csv = e.target?.result as string
//       // Simple CSV parsing - assuming single column of numbers
//       const numbers = csv
//         .split('\n')
//         .slice(1) // Skip header
//         .map(line => parseFloat(line.trim()))
//         .filter(num => !isNaN(num))
      
//       setCsvData(numbers)
//     }
//     reader.readAsText(file)
//   }

//   const handleCreateBinning = async () => {
//     if (csvData.length === 0) return

//     try {
//       await createBinning({
//         data: csvData,
//         n_bins: binCount,
//         method,
//         user_id: 'demo-user', // Replace with actual user ID from auth
//         model_name: `Model_${Date.now()}`
//       })
//     } catch (err) {
//       console.error('Binning failed:', err)
//     }
//   }

//   return (
//     <div className="p-6 max-w-6xl mx-auto">
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* Left Panel - Controls */}
//         <div className="space-y-6">
//           <div className="bg-white rounded-xl p-6 border border-gray-200">
//             <h2 className="text-2xl font-bold mb-4">Upload Credit Data</h2>
            
//             <div className="space-y-4">
//               <input
//                 type="file"
//                 accept=".csv"
//                 onChange={handleFileUpload}
//                 className="w-full p-2 border border-gray-300 rounded"
//               />
              
//               {csvData.length > 0 && (
//                 <p className="text-sm text-gray-600">
//                   Loaded {csvData.length} records
//                 </p>
//               )}

//               <div>
//                 <label className="block text-sm font-medium mb-2">
//                   Number of Bins
//                 </label>
//                 <input
//                   type="number"
//                   min="2"
//                   max="20"
//                   value={binCount}
//                   onChange={(e) => setBinCount(Number(e.target.value))}
//                   className="w-full p-2 border border-gray-300 rounded"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-2">
//                   Binning Method
//                 </label>
//                 <select
//                   value={method}
//                   onChange={(e) => setMethod(e.target.value as 'equal_width' | 'quantile')}
//                   className="w-full p-2 border border-gray-300 rounded"
//                 >
//                   <option value="equal_width">Equal Width</option>
//                   <option value="quantile">Quantile-based</option>
//                 </select>
//               </div>

//               <button
//                 onClick={handleCreateBinning}
//                 disabled={csvData.length === 0 || loading}
//                 className="w-full bg-emerald-600 text-white p-3 rounded-lg hover:bg-emerald-700 disabled:opacity-50"
//               >
//                 {loading ? 'Processing...' : 'Create Bins'}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Right Panel - Results */}
//         <div className="space-y-6">
//           {error && (
//             <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
//               Error: {error}
//             </div>
//           )}

//           {result && (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="bg-white rounded-xl p-6 border border-gray-200"
//             >
//               <h3 className="text-xl font-bold mb-4">Binning Results</h3>
              
//               {/* Distribution Chart */}
//               <div className="mb-6">
//                 <h4 className="font-medium mb-3">Risk Score Distribution</h4>
//                 <div className="flex items-end space-x-1 h-32">
//                   {result.distribution.percentages.map((percentage, index) => (
//                     <div
//                       key={index}
//                       className="bg-emerald-500 rounded-t flex-1 transition-all duration-300"
//                       style={{ height: `${(percentage / Math.max(...result.distribution.percentages)) * 100}%` }}
//                       title={`Bin ${index + 1}: ${percentage}%`}
//                     />
//                   ))}
//                 </div>
//                 <div className="flex justify-between text-xs text-gray-500 mt-2">
//                   <span>Low Risk</span>
//                   <span>High Risk</span>
//                 </div>
//               </div>

//               {/* Bin Details */}
//               <div className="space-y-2">
//                 <h4 className="font-medium">Bin Details</h4>
//                 <div className="max-h-64 overflow-y-auto space-y-2">
//                   {result.bins.map((bin) => (
//                     <div
//                       key={bin.bin_id}
//                       className="flex justify-between items-center p-3 bg-gray-50 rounded"
//                     >
//                       <div>
//                         <span className="font-medium">Bin {bin.bin_id}</span>
//                         <span className="text-sm text-gray-600 ml-2">
//                           ({bin.min_value} - {bin.max_value})
//                         </span>
//                       </div>
//                       <div className="text-right">
//                         <div className="font-medium">{bin.count} records</div>
//                         <div className="text-sm text-gray-600">{bin.percentage}%</div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </motion.div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }