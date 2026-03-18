/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { Download, Search, BookOpen, FilterX, Send, Twitter, Facebook, Instagram, Linkedin } from 'lucide-react';
import * as XLSX from 'xlsx';
import kuralsData from './data/merged_kurals.json';
import { Analytics } from "@vercel/analytics/react"

export default function App() {
  return (
    <>
      <Analytics />
      <MainApp />
    </>
  );
}

function MainApp() {
  const [visitorCount, setVisitorCount] = useState<number | null>(null);
  
  // Use a simple API to track and display total visitors
  // This is privacy-friendly as it only counts hits to this specific key
  useEffect(() => {
    fetch('https://api.counterapi.dev/v1/kuralvalam/visits/up')
      .then(res => res.json())
      .then(data => setVisitorCount(data.count))
      .catch(() => setVisitorCount(null));
  }, []);

  const [kuralNoSearch, setKuralNoSearch] = useState('');
  const [kuralTextSearch, setKuralTextSearch] = useState('');
  const [chapterNoSearch, setChapterNoSearch] = useState('');
  const [chapterNameSearch, setChapterNameSearch] = useState('');

  const filteredKurals = useMemo(() => {
    let result = kuralsData;

    if (kuralNoSearch.trim() !== '') {
      const num = parseInt(kuralNoSearch, 10);
      if (!isNaN(num)) {
        result = result.filter((k) => k.kuralNo === num);
      }
    }

    if (chapterNoSearch.trim() !== '') {
      const num = parseInt(chapterNoSearch, 10);
      if (!isNaN(num)) {
        result = result.filter((k) => k.athikaramNo === num);
      }
    }

    if (chapterNameSearch.trim() !== '') {
      const term = chapterNameSearch.toLowerCase().trim();
      result = result.filter((k) => 
        k.athikaramName.toLowerCase().includes(term) || 
        k.athikaramTranslation.toLowerCase().includes(term)
      );
    }

    if (kuralTextSearch.trim() !== '') {
      const term = kuralTextSearch.toLowerCase().trim();
      result = result.filter((k) => {
        return (
          k.kuralText.toLowerCase().includes(term) ||
          k.meaningTamil.toLowerCase().includes(term) ||
          k.meaningEnglish.toLowerCase().includes(term) ||
          k.translation.toLowerCase().includes(term)
        );
      });
    }

    return result;
  }, [kuralNoSearch, chapterNoSearch, chapterNameSearch, kuralTextSearch]);

  const handleExportExcel = () => {
    const exportData = filteredKurals.map((k, index) => ({
      'S.No': index + 1,
      'அதிகாரம் எண் Athikaram No': k.athikaramNo,
      'அதிகாரம் பெயர் Athikaram Name': k.athikaramName,
      'குறள் எண் Kural No': k.kuralNo,
      'பால் Paal': k.paal,
      'இயல் Iyal': k.iyal,
      'குறள் Kural': `${k.kuralLine1}\n${k.kuralLine2}`,
      'Meanings in Tamil': k.meaningTamil,
      'Meanings in English': k.meaningEnglish,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    
    // Set column widths for better readability in Excel
    worksheet['!cols'] = [
      { wch: 6 },   // S.No
      { wch: 25 },  // Athikaram No
      { wch: 30 },  // Athikaram Name
      { wch: 18 },  // Kural No
      { wch: 15 },  // Paal
      { wch: 18 },  // Iyal
      { wch: 55 },  // Kural (wider to fit 4 words without wrapping)
      { wch: 80 },  // Meaning Tamil (wider)
      { wch: 80 },  // Meaning English (wider)
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Thirukkural');
    XLSX.writeFile(workbook, 'Thirukkural_Export.xlsx');
  };

  const clearFilters = () => {
    setKuralNoSearch('');
    setKuralTextSearch('');
    setChapterNoSearch('');
    setChapterNameSearch('');
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans">
      <header className="bg-amber-700 text-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BookOpen className="h-8 w-8" />
            <h1 className="text-2xl font-bold tracking-tight">குறள் வளம் | Kural Valam</h1>
          </div>
          <div className="text-amber-100 text-sm font-medium">
            1330 Kurals • 133 Athikarams
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-stone-800">Advanced Search Filters</h2>
            <button
              onClick={clearFilters}
              className="inline-flex items-center px-3 py-1.5 border border-stone-300 shadow-sm text-sm font-medium rounded-lg text-stone-700 bg-white hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors"
            >
              <FilterX className="h-4 w-4 mr-2" />
              Clear Filters
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label htmlFor="kuralNo" className="block text-sm font-medium text-stone-700">
                Kural Number
              </label>
              <input
                type="number"
                id="kuralNo"
                className="block w-full px-3 py-2.5 border border-stone-300 rounded-xl focus:ring-amber-500 focus:border-amber-500 sm:text-sm bg-stone-50"
                placeholder="e.g. 1"
                value={kuralNoSearch}
                onChange={(e) => setKuralNoSearch(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="chapterNo" className="block text-sm font-medium text-stone-700">
                Chapter Number
              </label>
              <input
                type="number"
                id="chapterNo"
                className="block w-full px-3 py-2.5 border border-stone-300 rounded-xl focus:ring-amber-500 focus:border-amber-500 sm:text-sm bg-stone-50"
                placeholder="e.g. 1"
                value={chapterNoSearch}
                onChange={(e) => setChapterNoSearch(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="chapterName" className="block text-sm font-medium text-stone-700">
                Chapter Name
              </label>
              <input
                type="text"
                id="chapterName"
                className="block w-full px-3 py-2.5 border border-stone-300 rounded-xl focus:ring-amber-500 focus:border-amber-500 sm:text-sm bg-stone-50"
                placeholder="e.g. கடவுள் வாழ்த்து"
                value={chapterNameSearch}
                onChange={(e) => setChapterNameSearch(e.target.value)}
              />
            </div>
            <div className="space-y-2 md:col-span-3">
              <label htmlFor="kuralText" className="block text-sm font-medium text-stone-700">
                Keywords in Kural Text / Meaning
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-stone-400" />
                </div>
                <input
                  type="text"
                  id="kuralText"
                  className="block w-full pl-10 pr-3 py-2.5 border border-stone-300 rounded-xl focus:ring-amber-500 focus:border-amber-500 sm:text-sm bg-stone-50"
                  placeholder="Search by words in Kural, Tamil meaning, or English meaning..."
                  value={kuralTextSearch}
                  onChange={(e) => setKuralTextSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-stone-800">
            Results ({filteredKurals.length})
          </h2>
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Export to Excel
          </button>
        </div>

        <div className="bg-white shadow-sm border border-stone-200 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-stone-200">
              <thead className="bg-stone-100">
                <tr>
                  <th scope="col" className="px-2 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider whitespace-nowrap w-px">
                    S.No
                  </th>
                  <th scope="col" className="px-2 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider whitespace-nowrap w-px">
                    Athikaram No
                  </th>
                  <th scope="col" className="px-2 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider whitespace-nowrap w-px">
                    Athikaram Name
                  </th>
                  <th scope="col" className="px-2 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider whitespace-nowrap w-px">
                    Kural No
                  </th>
                  <th scope="col" className="px-2 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider whitespace-nowrap w-px">
                    Paal
                  </th>
                  <th scope="col" className="px-2 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider whitespace-nowrap w-px">
                    Iyal
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider whitespace-nowrap">
                    Kural
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider min-w-[400px]">
                    Meaning (Tamil)
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider min-w-[400px]">
                    Meaning (English)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-stone-200">
                {filteredKurals.length > 0 ? (
                  filteredKurals.map((kural, index) => (
                    <tr key={kural.kuralNo} className="hover:bg-stone-50 transition-colors">
                      <td className="px-2 py-2 whitespace-nowrap text-sm text-stone-500 w-px">
                        {index + 1}
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap text-sm text-stone-900 font-medium w-px text-center">
                        {kural.athikaramNo}
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap text-sm text-stone-900 w-px">
                        {kural.athikaramName}
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap text-sm text-stone-900 font-medium w-px text-center">
                        {kural.kuralNo}
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap text-sm text-stone-500 w-px">
                        {kural.paal}
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap text-sm text-stone-500 w-px">
                        {kural.iyal}
                      </td>
                      <td className="px-4 py-2 text-sm text-stone-900 font-medium leading-tight whitespace-nowrap">
                        <div>{kural.kuralLine1}</div>
                        <div>{kural.kuralLine2}</div>
                      </td>
                      <td className="px-4 py-2 text-sm text-stone-600 leading-snug">
                        {kural.meaningTamil}
                      </td>
                      <td className="px-4 py-2 text-sm text-stone-600 leading-snug">
                        {kural.meaningEnglish}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="px-4 py-12 text-center text-sm text-stone-500">
                      No Kurals found matching your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <footer className="bg-stone-900 text-stone-300 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            {/* Brand Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-white">
                <BookOpen className="h-8 w-8 text-amber-500" />
                <span className="text-xl font-bold tracking-tight">KURAL VALAM</span>
              </div>
              <p className="text-sm leading-relaxed text-stone-400">
                Inspiring life through the timeless wisdom of Thirukkural. A modern home for ancient Tamil ethics.
              </p>
            </div>

            {/* Explore Section */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-amber-500 mb-6">Explore</h3>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="#" className="hover:text-white transition-colors">About Thirukkural</a></li>
                <li><a href="#" className="hover:text-white transition-colors">All Chapters</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Themes</a></li>
              </ul>
            </div>

            {/* Resources Section */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-amber-500 mb-6">Resources</h3>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Commentaries</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Kural of the Day</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Daily Wisdom</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>

            {/* Social & Newsletter Section */}
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-amber-500 mb-6">Foliage</h3>
                <div className="flex space-x-5">
                  <a href="#" className="text-stone-400 hover:text-white transition-colors"><Twitter className="h-5 w-5" /></a>
                  <a href="#" className="text-stone-400 hover:text-white transition-colors"><Facebook className="h-5 w-5" /></a>
                  <a href="#" className="text-stone-400 hover:text-white transition-colors"><Instagram className="h-5 w-5" /></a>
                  <a href="#" className="text-stone-400 hover:text-white transition-colors"><Linkedin className="h-5 w-5" /></a>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-widest text-amber-500">Newsletter</h3>
                <div className="flex">
                  <input 
                    type="email" 
                    placeholder="Email Input" 
                    className="bg-stone-800 border-none rounded-l-lg px-4 py-2 text-sm w-full focus:ring-1 focus:ring-amber-500"
                  />
                  <button className="bg-amber-600 hover:bg-amber-700 text-white rounded-r-lg px-4 py-2 text-sm font-bold transition-colors">
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* View Counter Section */}
          <div className="flex flex-col items-center justify-center py-12 border-t border-stone-800">
            <h4 className="text-lg font-serif italic text-amber-100 mb-6">Live Views</h4>
            <div className="bg-stone-800/50 border border-amber-900/30 rounded-2xl px-12 py-8 text-center shadow-inner">
              <p className="text-xs uppercase tracking-[0.2em] text-amber-600/70 mb-2 font-bold">Total Visitors</p>
              <p className="text-5xl font-bold text-amber-500 tracking-tighter">
                {visitorCount ? visitorCount.toLocaleString() : '---'}
              </p>
            </div>
            <p className="mt-6 text-[10px] text-stone-500 uppercase tracking-widest">
              Real-time Website Traffic | Visited since 2023
            </p>
          </div>

          {/* Copyright Section */}
          <div className="pt-8 border-t border-stone-800 text-center">
            <p className="text-[11px] text-stone-500 tracking-wide uppercase">
              © 2024 Kural Valam | Built with reverence for Thirukkural | All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
