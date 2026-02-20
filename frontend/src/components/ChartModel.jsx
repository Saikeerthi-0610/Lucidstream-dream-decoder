// import { motion, AnimatePresence } from "framer-motion";

// export default function ChartModal({ open, onClose, children }) {
//   return (
//     <AnimatePresence>
//       {open && (
//         <motion.div
//           className="modal-overlay"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           onClick={onClose}
//         >
//           <motion.div
//             className="modal-content"
//             initial={{ scale: 0.8 }}
//             animate={{ scale: 1 }}
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button className="close-btn" onClick={onClose}>✕</button>
//             {children}
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// }
