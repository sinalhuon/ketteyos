import { Metadata } from 'next';
import ClientDemoPage from './client-page';

export async function generateStaticParams() {
    return [{ templateId: 'default' }];
}

export default async function DemoPage({ params }: { params: Promise<{ templateId: string }> }) {
    const resolvedParams = await params;
    return <ClientDemoPage templateId={resolvedParams.templateId} />;
}
