import React from 'react';

interface ConfirmationModalProps {
    isOpen: boolean;
    title: string;
    description: string;
    confirmLabel: string;
    cancelLabel: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    title,
    description,
    confirmLabel,
    cancelLabel,
    onConfirm,
    onCancel
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
            <div className="w-full max-w-sm bg-zinc-950 border border-zinc-900 p-8 rounded-sm shadow-2xl scale-in-center">
                <h3 className="text-xl font-bold tracking-tighter text-zinc-100 uppercase mb-4 italic border-b border-zinc-900 pb-2">
                    {title}
                </h3>
                <p className="text-sm text-zinc-500 mb-8 leading-relaxed italic">
                    {description}
                </p>
                <div className="flex flex-col gap-3">
                    <button
                        onClick={onConfirm}
                        className="w-full py-3 bg-red-900/10 border border-red-900 text-red-500 font-bold uppercase tracking-widest text-xs hover:bg-red-900 hover:text-white transition-all duration-300"
                    >
                        {confirmLabel}
                    </button>
                    <button
                        onClick={onCancel}
                        className="w-full py-3 bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold uppercase tracking-widest text-xs hover:border-zinc-100 hover:text-zinc-100 transition-all duration-300"
                    >
                        {cancelLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
