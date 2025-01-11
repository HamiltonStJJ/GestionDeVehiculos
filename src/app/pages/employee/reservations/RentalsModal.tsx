import React , {useState}from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, AlertCircle, DollarSign, ClipboardCheck } from 'lucide-react';

// Confirmation Modal
interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>; 
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm }) => {
const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm(); // Llamar a la función de confirmación
    } finally {
      setIsLoading(false);
    }
  };

return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl"
          >
            <div className="flex items-center mb-4 text-green-600">
              <AlertCircle className="w-6 h-6 mr-2" />
              <h2 className="text-2xl font-bold">Confirmar Autorización</h2>
            </div>

            <p className="mb-6 text-gray-600">
              ¿Está seguro que desea autorizar esta reservación?
            </p>

            <div className="flex justify-end space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="px-6 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 
                          transition-colors duration-200 flex items-center"
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </motion.button>

                <motion.button
                whileHover={{ scale: isLoading ? 1 : 1.05 }}
                whileTap={{ scale: isLoading ? 1 : 0.95 }}
                onClick={handleConfirm}
                disabled={isLoading}
                className={`px-6 py-2 rounded-lg flex items-center justify-center ${
                  isLoading
                  ? 'bg-green-500 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
                } text-white transition-colors duration-200`}
                style={{ minWidth: '120px' }} // Ensure the button has a minimum width
                >
                {isLoading ? (
                  <span className="loading loading-dots loading-mg" />
                ) : (
                  <>
                  <Check className="w-4 h-4 mr-2" />
                  Confirmar
                  </>
                )}
                </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Devolution Details Modal
export interface DevolutionDetails {
  auto: {
    nombre: string;
    valor: number;
  };
  piezasRevisadas: {
    pieza: string;
    estado: string;
    penalizacion: number;
  }[];
  valorDanios: number;
  valorDias: number;
  total: number;
  restante: number;
  fechaDevolucion: string;
}


interface DevolutionModalProps {
  details?: DevolutionDetails;
  onClose: () => void;
}
const DevolutionModal: React.FC<DevolutionModalProps> = ({ details, onClose }) => {
  if (!details) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center text-blue-600">
            <ClipboardCheck className="w-6 h-6 mr-2" />
            <h2 className="text-2xl font-bold">Detalles de la Devolución</h2>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </motion.button>
        </div>

        <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
            <p className="font-medium">Nombre del Vehículo:</p>
            <p className="text-lg font-bold text-blue-600">{details.auto.nombre}</p>
          </div>

          <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
            <p className="font-medium">Valor del Vehículo:</p>
            <p className="text-lg font-bold text-green-600">${details.auto.valor}</p>
          </div>

          <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
            <p className="font-medium">Total de Daños:</p>
            <p className="text-lg font-bold text-red-600">${details.valorDanios}</p>
          </div>

          <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
            <p className="font-medium">Penalización por Días Extra:</p>
            <p className="text-lg font-bold text-red-600">${details.valorDias}</p>
          </div>

          <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
            <p className="font-medium">Total Final:</p>
            <p className="text-lg font-bold text-blue-600">${details.total}</p>
          </div>

          <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
            <p className="font-medium">Monto Restante a pagar:</p>
            <p className="text-lg font-bold text-orange-600">${details.restante}</p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-bold text-lg mb-3 flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            Detalle de Penalizaciones
          </h3>
          <div className="space-y-2">
            {details.piezasRevisadas.map((pieza, index) => (
              <motion.div
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="ml-4 p-3 bg-white rounded-lg shadow-sm flex justify-between"
              >
                <span>
                  {pieza.pieza}:{" "}
                  <span
                    className={`font-medium ${
                      pieza.estado === "Dañado" ? "text-red-500" : "text-green-500"
                    }`}
                  >
                    {pieza.estado}
                  </span>
                </span>
                <span className="font-bold">${pieza.penalizacion}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg 
                      hover:bg-blue-700 transition-colors duration-200 
                      flex items-center"
          >
            <Check className="w-4 h-4 mr-2" />
            Cerrar
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};
export { ConfirmationModal, DevolutionModal };