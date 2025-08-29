import Footer from '@/components/shared/Footer'
import Header from '@/components/shared/Header'
import { Outlet } from 'react-router-dom'

export const MainLayout = () => {
    return (
        <div>
            <Header />
            <Outlet />
            <Footer />
        </div>
    )
}
