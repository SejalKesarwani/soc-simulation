import { useState } from 'react';
import { ChevronDown, ChevronRight, Filter } from 'lucide-react';

const ATTACK_TYPES = ['DDoS', 'Phishing', 'Malware', 'SQL Injection', 'XSS'];
const SEVERITIES = ['Low', 'Medium', 'High', 'Critical'];
const STATUSES = ['Active', 'Investigating', 'Resolved'];

function Section({ title, isOpen, onToggle, children }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-white hover:bg-white/5"
      >
        <span>{title}</span>
        {isOpen ? (
          <ChevronDown className="h-4 w-4 text-gray-300" />
        ) : (
          <ChevronRight className="h-4 w-4 text-gray-300" />
        )}
      </button>
      {isOpen && <div className="px-4 pb-4 pt-1 space-y-2 text-sm text-gray-200">{children}</div>}
    </div>
  );
}

function FilterSidebar({ onFilterChange = () => {} }) {
  const [openSections, setOpenSections] = useState({
    attack: true,
    severity: true,
    status: true,
    date: false,
    search: false,
  });

  const [filters, setFilters] = useState({
    attackTypes: [],
    severities: [],
    statuses: [],
    dateFrom: '',
    dateTo: '',
    ipSearch: '',
  });

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleValue = (key, value) => {
    setFilters((prev) => {
      const list = prev[key];
      const exists = list.includes(value);
      const nextList = exists ? list.filter((item) => item !== value) : [...list, value];
      return { ...prev, [key]: nextList };
    });
  };

  const handleInputChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onFilterChange(filters);
  };

  const handleClear = () => {
    const reset = {
      attackTypes: [],
      severities: [],
      statuses: [],
      dateFrom: '',
      dateTo: '',
      ipSearch: '',
    };
    setFilters(reset);
    onFilterChange(reset);
  };

  return (
    <aside className="w-full max-w-xs lg:max-w-none lg:w-64 shrink-0 space-y-3 sm:space-y-4 bg-slate p-3 sm:p-4 text-white rounded-xl border border-white/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Filter className="h-4 w-4 text-blue-300" />
          Filters
        </div>
        <button
          type="button"
          onClick={handleClear}
          className="text-xs text-gray-300 hover:text-white underline"
        >
          Clear All
        </button>
      </div>

      <Section title="Attack Type" isOpen={openSections.attack} onToggle={() => toggleSection('attack')}>
        {ATTACK_TYPES.map((type) => (
          <label key={type} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-white/30 bg-white/5 text-blue-500 focus:ring-blue-500"
              checked={filters.attackTypes.includes(type)}
              onChange={() => toggleValue('attackTypes', type)}
            />
            <span>{type}</span>
          </label>
        ))}
      </Section>

      <Section title="Severity" isOpen={openSections.severity} onToggle={() => toggleSection('severity')}>
        {SEVERITIES.map((sev) => (
          <label key={sev} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-white/30 bg-white/5 text-blue-500 focus:ring-blue-500"
              checked={filters.severities.includes(sev)}
              onChange={() => toggleValue('severities', sev)}
            />
            <span>{sev}</span>
          </label>
        ))}
      </Section>

      <Section title="Status" isOpen={openSections.status} onToggle={() => toggleSection('status')}>
        {STATUSES.map((stat) => (
          <label key={stat} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-white/30 bg-white/5 text-blue-500 focus:ring-blue-500"
              checked={filters.statuses.includes(stat)}
              onChange={() => toggleValue('statuses', stat)}
            />
            <span>{stat}</span>
          </label>
        ))}
      </Section>

      <Section title="Date Range" isOpen={openSections.date} onToggle={() => toggleSection('date')}>
        <div className="space-y-2">
          <label className="block text-xs text-gray-300">
            From
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleInputChange('dateFrom', e.target.value)}
              className="mt-1 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
            />
          </label>
          <label className="block text-xs text-gray-300">
            To
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleInputChange('dateTo', e.target.value)}
              className="mt-1 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
            />
          </label>
        </div>
      </Section>

      <Section title="Search IP" isOpen={openSections.search} onToggle={() => toggleSection('search')}>
        <input
          type="text"
          placeholder="e.g. 192.168.1.10"
          value={filters.ipSearch}
          onChange={(e) => handleInputChange('ipSearch', e.target.value)}
          className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:border-blue-500 focus:outline-none"
        />
      </Section>

      <div className="flex flex-col sm:flex-row gap-2 pt-1">
        <button
          type="button"
          onClick={handleApply}
          className="w-full sm:w-auto flex-1 rounded-lg bg-blue-600 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Apply Filters
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="w-full sm:w-auto flex-1 rounded-lg bg-white/10 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-gray-200 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
        >
          Clear All
        </button>
      </div>
    </aside>
  );
}

export default FilterSidebar;
