import create from 'zustand';

export const useModalStore = create((set) => ({
	modal: false,
	open: () => set((state: { modal: boolean }) => ({ modal: true })),
	close: () => set((state: { modal: boolean }) => ({ modal: false }))
}));
