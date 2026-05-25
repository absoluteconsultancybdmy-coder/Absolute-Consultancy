{/* Left — COO Photo */}
<div className="relative h-[400px] lg:h-[520px] overflow-hidden">
  <img
    src="images/coo-profile2.png"
    alt="COO - Absolute Consultancy Firm"
    className="w-full h-full object-cover object-top"
  />
  {/* Gold gradient overlay */}
  <div className="absolute inset-0" style={{
    background: 'linear-gradient(to right, transparent 60%, rgba(11,30,66,0.95) 100%), linear-gradient(to top, rgba(11,30,66,0.6) 0%, transparent 50%)',
  }} />
  {/* Certified badge on photo */}
  <div className="absolute top-6 left-6">
    <span className="px-4 py-2 rounded-full text-[10px] font-body uppercase tracking-widest"
      style={{ background: 'rgba(201,162,52,0.9)', color: '#0A0A0A', fontWeight: 600 }}>
      ✓ Certified Education Counsellor
    </span>
  </div>
</div>