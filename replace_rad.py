import re

with open("src/components/PatientChartModal.tsx", "r") as f:
    content = f.read()

target = r"  if \(showOrderRadForm\) \{[\s\S]*?  if \(showPrescribeForm\) \{"

replacement = """  if (showOrderRadForm) {
    return (
      <RadiologyOrderForm 
        isAr={isAr}
        patientGender={currentPatient?.gender || currentPatient?.genderEn}
        onClose={() => setShowOrderRadForm(false)}
        onSubmit={(orderData) => {
          const currentOrders = currentPatient.orders || [];
          const newOrders = orderData.procedures.map((procName: string, index: number) => ({
            id: `ord-${Date.now()}-${index}`,
            type: "RAD",
            name: procName,
            status: "Ordered",
            date: new Date().toLocaleDateString(),
            urgency: orderData.urgency,
            clinicalIndication: orderData.clinicalIndication,
            transportMode: orderData.transportMode,
            pregnancyStatus: orderData.pregnancyStatus,
            timestamp: orderData.timestamp
          }));
          
          updatePatient(currentPatient.id, { orders: [...newOrders, ...currentOrders] });
          
          setCpoeOrders((prev: any[]) => [
            ...newOrders.map((ord: any) => ({
              id: ord.id,
              patientName: currentPatient.nameEn || currentPatient.nameAr,
              mrn: currentPatient.mrn,
              orderType: "Radiology",
              orderName: ord.name,
              priority: ord.urgency,
              status: "Pending",
              timestamp: ord.timestamp
            })),
            ...(prev || [])
          ]);
          
          setShowOrderRadForm(false);
          setActiveTab("orders");
          toast.success(isAr ? `تم إرسال ${orderData.procedures.length} طلبات أشعة بنجاح (RIS).` : `Successfully dispatched ${orderData.procedures.length} radiology orders to RIS.`);
        }}
      />
    );
  }

  if (showPrescribeForm) {"""

new_content = re.sub(target, replacement, content)

with open("src/components/PatientChartModal.tsx", "w") as f:
    f.write(new_content)
