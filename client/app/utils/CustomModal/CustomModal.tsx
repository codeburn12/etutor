'use client'
import React, { FC } from 'react'
import { Modal , Box} from '@mui/material'

type Props = {
    open: boolean;
    setOpen: (open: boolean) => void;
    activeItem: number;
    route: string;
    setRoute: (route: string) => void;
    component: (props: any) => JSX.Element;
}

const CustomModal: FC<Props> = ({ open, setOpen, setRoute, component:Component }) => {
    return (
        <Modal
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box
                className="dark:bg-slate-900"
                sx={{
                    
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    maxWidth: '100%', // Optional: Adjust maximum width as needed
                    maxHeight: '90vh', // Optional: Adjust maximum height as needed
                    overflowY: 'auto', // Optional: Enable vertical scrolling if content overflows
                    bgcolor: 'background.default', // Optional: Use Material-UI theme color for background
                    borderRadius: 1, // Optional: Add border radius for rounded corners
                    p: 2, // Optional: Add padding
                    
                }}
            >
                <Component setOpen={setOpen} setRoute={setRoute} />
            </Box>
        </Modal>
    )
}

export default CustomModal