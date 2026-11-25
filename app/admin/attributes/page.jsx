import AttributeTable from '@/components/admin/AttributeTable';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { attributes } from '@/lib/dummyData';

export default function AdminAttributes() {
  return (
    <div>
      <AdminPageHeader
        title="Attributes"
        description="Voltage, capacity, brand, battery type, and other options used on products and filters."
        action={{ href: '/admin/attributes/create', label: '+ Add attribute' }}
      />
      <AttributeTable attributes={attributes} />
    </div>
  );
}
