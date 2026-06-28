    // ── SHIFT MANAGEMENT SYSTEM ──
    const btnShiftToggle = document.getElementById('btn-shift-toggle');
    const shiftTimerDisplay = document.getElementById('shift-timer-display');
    const modalShiftReport = document.getElementById('modal-shift-report');
    const shiftReportBody = document.getElementById('shift-report-body');
    const btnSaveShift = document.getElementById('btn-save-shift');

    function getActiveShift() {
      const s = localStorage.getItem('aura_active_shift');
      return s ? JSON.parse(s) : null;
    }

    function setActiveShift(shiftObj) {
      if (shiftObj) {
        localStorage.setItem('aura_active_shift', JSON.stringify(shiftObj));
      } else {
        localStorage.removeItem('aura_active_shift');
      }
    }

    function renderShiftToggle() {
      if (!btnShiftToggle) return;
      const activeShift = getActiveShift();
      if (activeShift) {
        btnShiftToggle.innerHTML = '<i data-lucide="square" style="width: 16px; height: 16px; margin-right: 6px;"></i> <span>Smenani tugatish</span>';
        btnShiftToggle.style.background = '#ef4444';
        btnShiftToggle.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.2)';
        shiftTimerDisplay.style.display = 'block';
      } else {
        btnShiftToggle.innerHTML = '<i data-lucide="play" style="width: 16px; height: 16px; margin-right: 6px;"></i> <span>Smenani boshlash</span>';
        btnShiftToggle.style.background = '#0045d8';
        btnShiftToggle.style.boxShadow = '0 4px 12px rgba(0, 69, 216, 0.2)';
        shiftTimerDisplay.style.display = 'none';
      }
      lucide.createIcons();
    }

    function updateShiftTimer() {
      const activeShift = getActiveShift();
      if (activeShift && shiftTimerDisplay) {
        const now = new Date();
        const start = new Date(activeShift.startTime);
        const diffSecs = Math.floor((now - start) / 1000);
        
        const h = Math.floor(diffSecs / 3600).toString().padStart(2, '0');
        const m = Math.floor((diffSecs % 3600) / 60).toString().padStart(2, '0');
        const s = (diffSecs % 60).toString().padStart(2, '0');
        
        shiftTimerDisplay.innerText = `Ish vaqti: ${h}:${m}:${s}`;
      }
    }

    function generateShiftReportHTML(shiftData) {
      const { 
        startTime, endTime, 
        ps4Amount, ps4Hours, ps4Count,
        ps5Amount, ps5Hours, ps5Count,
        vipAmount, vipHours, vipCount,
        totalPlayAmount, drinksList, totalDrinksAmount,
        kalyanList, totalKalyanAmount, totalKalyanProfit,
        totalSales, totalProfit, totalClients, totalSessions
      } = shiftData;

      const formatDt = d => new Date(d).toLocaleString('uz-UZ', {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'});
      const diffMs = new Date(endTime) - new Date(startTime);
      const diffH = Math.floor(diffMs / 3600000);
      const diffM = Math.floor((diffMs % 3600000) / 60000);

      let drinksHtml = drinksList.map(d => `
        <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 4px;">
          <span>${d.name} (${d.qty} dona)</span>
          <span>${formatMoney(d.total)}</span>
        </div>
      `).join('');
      if (!drinksHtml) drinksHtml = '<div style="font-size: 13px; color: #9ca3af; font-style: italic;">Sotuv bo\'lmagan</div>';

      let kalyanHtml = kalyanList.map(k => `
        <div style="font-size: 14px; margin-bottom: 8px; border-bottom: 1px dashed #e2e8f0; padding-bottom: 4px;">
          <div style="display: flex; justify-content: space-between; font-weight: 600;">
            <span>${k.name} (${k.qty} dona)</span>
            <span>${formatMoney(k.total)}</span>
          </div>
          <div style="color: #10b981; font-size: 12px; text-align: right;">Foyda: ${formatMoney(k.profit)}</div>
        </div>
      `).join('');
      if (!kalyanHtml) kalyanHtml = '<div style="font-size: 13px; color: #9ca3af; font-style: italic;">Sotuv bo\'lmagan</div>';

      return `
        <div style="background: #f8fafc; padding: 12px; border-radius: 8px; margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 14px;">
            <span style="color: #6b7280;">Boshlangan:</span>
            <span style="font-weight: 600;">${formatDt(startTime)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 14px;">
            <span style="color: #6b7280;">Tugagan:</span>
            <span style="font-weight: 600;">${formatDt(endTime)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px;">
            <span style="color: #6b7280;">Jami ishlagan:</span>
            <span style="font-weight: 600;">${diffH} soat ${diffM} daqiqa</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 14px;">
            <span style="color: #6b7280;">Xizmat ko'rsatilgan mijozlar (Cheklar):</span>
            <span style="font-weight: 600; color: #0045d8;">${totalClients} ta</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 14px;">
            <span style="color: #6b7280;">PlayStation sessiyalar:</span>
            <span style="font-weight: 600; color: #0045d8;">${totalSessions} ta</span>
          </div>
        </div>

        <h4 style="font-size: 15px; font-weight: 700; color: #1e293b; margin-bottom: 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">PlayStation tushumi</h4>
        <div style="margin-bottom: 16px; padding: 0 4px;">
          <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 4px;">
            <span>PS4 (${ps4Count} ta seans, ${ps4Hours.toFixed(1)} soat)</span>
            <span>${formatMoney(ps4Amount)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 4px;">
            <span>PS5 (${ps5Count} ta seans, ${ps5Hours.toFixed(1)} soat)</span>
            <span>${formatMoney(ps5Amount)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 4px;">
            <span>VIP (${vipCount} ta seans, ${vipHours.toFixed(1)} soat)</span>
            <span>${formatMoney(vipAmount)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 14px; font-weight: 700; margin-top: 8px;">
            <span>Jami PlayStation</span>
            <span>${formatMoney(totalPlayAmount)}</span>
          </div>
        </div>

        <h4 style="font-size: 15px; font-weight: 700; color: #1e293b; margin-bottom: 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">Ichimliklar & Boshqalar</h4>
        <div style="margin-bottom: 16px; padding: 0 4px;">
          ${drinksHtml}
          <div style="display: flex; justify-content: space-between; font-size: 14px; font-weight: 700; margin-top: 8px; border-top: 1px dashed #e2e8f0; padding-top: 4px;">
            <span>Jami ichimliklar</span>
            <span>${formatMoney(totalDrinksAmount)}</span>
          </div>
        </div>

        <h4 style="font-size: 15px; font-weight: 700; color: #1e293b; margin-bottom: 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">Kalyan</h4>
        <div style="margin-bottom: 16px; padding: 0 4px;">
          ${kalyanHtml}
          <div style="display: flex; justify-content: space-between; font-size: 14px; font-weight: 700; margin-top: 4px;">
            <span>Jami Kalyan</span>
            <span>${formatMoney(totalKalyanAmount)}</span>
          </div>
        </div>

        <div style="background: #1e293b; color: white; padding: 16px; border-radius: 12px; margin-top: 24px;">
          <h4 style="font-size: 16px; text-align: center; margin-bottom: 12px; font-weight: 600; color: #94a3b8;">Yakuniy natija</h4>
          <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 6px;">
            <span style="color: #cbd5e1;">PlayStation savdosi</span>
            <span>${formatMoney(totalPlayAmount)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 6px;">
            <span style="color: #cbd5e1;">Ichimlik savdosi</span>
            <span>${formatMoney(totalDrinksAmount)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 12px;">
            <span style="color: #cbd5e1;">Kalyan savdosi</span>
            <span>${formatMoney(totalKalyanAmount)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: 700; margin-bottom: 6px; border-top: 1px solid #334155; padding-top: 12px;">
            <span>Umumiy savdo</span>
            <span style="color: #38bdf8;">${formatMoney(totalSales)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: 800;">
            <span>Sof tushum (Foyda)</span>
            <span style="color: #34d399;">${formatMoney(totalProfit)}</span>
          </div>
        </div>
      `;
    }

    let currentCalculatedShift = null;

    if (btnShiftToggle) {
      btnShiftToggle.addEventListener('click', () => {
        const activeShift = getActiveShift();
        if (!activeShift) {
          // Start Shift
          setActiveShift({ startTime: new Date().toISOString() });
          renderShiftToggle();
          updateShiftTimer();
          addLog(sessionStorage.getItem('aura_logged_role') === 'admin' ? 'Admin' : 'Operator', 'Yangi smena boshladi');
        } else {
          // End Shift
          const endTime = new Date().toISOString();
          const startDt = new Date(activeShift.startTime);
          
          // Calculate stats
          const shiftOrders = orders.filter(o => new Date(o.timestamp) >= startDt);
          
          let ps4Amount = 0, ps4Hours = 0, ps4Count = 0;
          let ps5Amount = 0, ps5Hours = 0, ps5Count = 0;
          let vipAmount = 0, vipHours = 0, vipCount = 0;
          
          const drinksMap = {};
          const kalyanMap = {};
          let totalDrinksAmount = 0;
          let totalKalyanAmount = 0;
          let totalKalyanProfit = 0;

          shiftOrders.forEach(o => {
            // Sessions
            if (o.playAmount > 0) {
              const cabin = cabins.find(c => c.id === o.cabinId);
              let cType = cabin ? cabin.type : 'PS4';
              let isVip = cabin && cabin.id === 'VIP';
              const durationH = o.durationMins ? (o.durationMins / 60) : 0;
              
              if (isVip) {
                vipAmount += o.playAmount; vipHours += durationH; vipCount++;
              } else if (cType === 'PS5') {
                ps5Amount += o.playAmount; ps5Hours += durationH; ps5Count++;
              } else {
                ps4Amount += o.playAmount; ps4Hours += durationH; ps4Count++;
              }
            }
            
            // Products
            if (o.products && o.products.length > 0) {
              o.products.forEach(p => {
                const prodSum = p.price * p.quantity;
                if (p.category === 'Kalyanlar') {
                  const prodObj = PRODUCTS_LIST.find(pl => pl.id === p.id);
                  const pProfit = prodObj ? (prodObj.adminProfit * p.quantity) : prodSum;
                  totalKalyanAmount += prodSum;
                  totalKalyanProfit += pProfit;
                  if (!kalyanMap[p.id]) kalyanMap[p.id] = { name: p.name, qty: 0, total: 0, profit: 0 };
                  kalyanMap[p.id].qty += p.quantity;
                  kalyanMap[p.id].total += prodSum;
                  kalyanMap[p.id].profit += pProfit;
                } else {
                  totalDrinksAmount += prodSum;
                  if (!drinksMap[p.id]) drinksMap[p.id] = { name: p.name, qty: 0, total: 0 };
                  drinksMap[p.id].qty += p.quantity;
                  drinksMap[p.id].total += prodSum;
                }
              });
            }
          });

          const totalPlayAmount = ps4Amount + ps5Amount + vipAmount;
          const totalSales = totalPlayAmount + totalDrinksAmount + totalKalyanAmount;
          // Calculate total profit. Assume playAmount and drinksAmount are 100% profit as per simple model, minus kalyan non-profit part.
          // The formula: totalPlayAmount + totalDrinksAmount + totalKalyanProfit.
          const totalProfit = totalPlayAmount + totalDrinksAmount + totalKalyanProfit;

          currentCalculatedShift = {
            id: 'SHIFT-' + Date.now(),
            startTime: activeShift.startTime,
            endTime: endTime,
            ps4Amount, ps4Hours, ps4Count,
            ps5Amount, ps5Hours, ps5Count,
            vipAmount, vipHours, vipCount,
            totalPlayAmount,
            drinksList: Object.values(drinksMap),
            totalDrinksAmount,
            kalyanList: Object.values(kalyanMap),
            totalKalyanAmount,
            totalKalyanProfit,
            totalSales,
            totalProfit,
            totalClients: shiftOrders.length,
            totalSessions: ps4Count + ps5Count + vipCount
          };

          shiftReportBody.innerHTML = generateShiftReportHTML(currentCalculatedShift);
          modalShiftReport.classList.add('active');
        }
      });
    }

    if (btnSaveShift) {
      btnSaveShift.addEventListener('click', () => {
        if (!currentCalculatedShift) return;
        
        // Save to shifts history
        const storedShifts = localStorage.getItem('aura_shifts_history');
        const shiftsHistory = storedShifts ? JSON.parse(storedShifts) : [];
        shiftsHistory.push(currentCalculatedShift);
        localStorage.setItem('aura_shifts_history', JSON.stringify(shiftsHistory));
        
        // Clear active shift
        setActiveShift(null);
        renderShiftToggle();
        modalShiftReport.classList.remove('active');
        addLog(sessionStorage.getItem('aura_logged_role') === 'admin' ? 'Admin' : 'Operator', 'Smenani yopdi (Tushum: ' + formatMoney(currentCalculatedShift.totalProfit) + ')');
        
        // Refresh admin side if needed
        if (typeof renderAdminShifts === 'function') renderAdminShifts();
      });
    }
    
    // Initial Render
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', renderShiftToggle);
    } else {
      renderShiftToggle();
    }
