import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import { useApp } from '@/hooks/useApp';

const Modal = ({ show, onClose, title, children, maxWidth = 'md' }) => {
    const { isDark } = useApp();

    const maxWidthClass = {
        sm: 'sm:max-w-sm',
        md: 'sm:max-w-md',
        lg: 'sm:max-w-lg',
        xl: 'sm:max-w-xl',
        '2xl': 'sm:max-w-2xl',
    }[maxWidth];

    return (
        <Transition show={show} as={Fragment}>
            <Dialog as="div" className="relative z-[100]" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className={`w-full ${maxWidthClass} transform overflow-hidden rounded-[2.5rem] bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-white/10 p-10 text-left align-middle shadow-2xl transition-all duration-500`}>
                                {(title || onClose) && (
                                    <div className="flex items-center justify-between mb-8">
                                        <Dialog.Title as="h3" className="text-xl font-black text-black dark:text-white tracking-tighter uppercase italic">
                                            {title}
                                        </Dialog.Title>
                                        {onClose && (
                                            <button
                                                onClick={onClose}
                                                className="text-gray-400 dark:text-white/20 hover:text-black dark:hover:text-white p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-all"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                )}
                                {children}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default Modal;
