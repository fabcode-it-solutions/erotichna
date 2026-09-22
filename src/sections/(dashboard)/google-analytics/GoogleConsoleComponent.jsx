import React, { useState } from 'react';
import countries from 'i18n-iso-countries';
import en from 'i18n-iso-countries/langs/en.json';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import LineChart from './LineChart';


countries.registerLocale(en);

const GoogleConsoleComponent = ({ values }) => {
    const [activeTab, setActiveTab] = useState(1);
    const [pagination, setPagination] = useState({
        1: { currentPage: 1, itemsPerPage: 5 },
        2: { currentPage: 1, itemsPerPage: 5 },
        3: { currentPage: 1, itemsPerPage: 5 },
        4: { currentPage: 1, itemsPerPage: 5 },
        5: { currentPage: 1, itemsPerPage: 5 },
        6: { currentPage: 1, itemsPerPage: 5 },
    });

    const heading = [
        { name: "QUERIES", id: 1 },
        { name: "PAGES", id: 2 },
        { name: "COUNTRIES", id: 3 },
        { name: "DEVICES", id: 4 },
        { name: "SEARCH APPEARANCE", id: 5 },
        { name: "DATES", id: 6 }
    ];

    const handlePageChange = (tabId, page) => {
        setPagination(prevPagination => ({
            ...prevPagination,
            [tabId]: {
                ...prevPagination[tabId],
                currentPage: page,
            },
        }));
    };

    const handleItemsPerPageChange = (tabId, e) => {
        setPagination(prevPagination => ({
            ...prevPagination,
            [tabId]: {
                ...prevPagination[tabId],
                itemsPerPage: Number(e.target.value),
                currentPage: 1,
            },
        }));
    };

    const renderTable = (data, tabId) => {
        const { currentPage, itemsPerPage } = pagination[tabId];
        const startIndex = (currentPage - 1) * itemsPerPage;
        const currentData = data.slice(startIndex, startIndex + itemsPerPage);
        const totalPages = Math.ceil(data.length / itemsPerPage);
        const startItem = startIndex + 1;
        const endItem = Math.min(startIndex + currentData.length, data.length);

        return (
            <div className="bg-white p-6 rounded-xl transition-all duration-300 min-h-[300px]">
                {/* Tabs Header */}
                <div className="w-full flex flex-wrap gap-2 md:flex mb-4">
                    {heading.map(item => (
                        <span
                            key={item.id}
                            className={`flex-grow cursor-pointer py-2 text-[12px] font-semibold text-center transition-all duration-200 ${activeTab === item.id
                                ? 'font-bold text-black border-b-2 border-slate-600'
                                : 'text-gray-600 hover:bg-gray-200 rounded-md'
                                }`}
                            onClick={() => setActiveTab(item.id)}
                            aria-selected={activeTab === item.id}
                        >
                            {item.name}
                        </span>
                    ))}
                </div>

                {currentData.length > 0 ? (
                    <div className="w-full overflow-x-auto">
                        {/* Horizontal scroll for mobile */}
                        <div className="min-w-[700px]">
                            {/* Table Heading */}
                            <div className="grid grid-cols-12 gap-2 font-bold border-b text-[12px] pb-2 text-gray-700">
                                <div className="px-2 col-span-7 lg:col-span-8 text-[12px] ">{heading.find(h => h.id === tabId)?.name}</div>
                                <div className="col-span-1 lg:col-span-1 text-[12px] text-center">Clicks</div>
                                <div className=" col-span-2 lg:col-span-1 text-[12px] text-center">Impressions</div>
                                <div className=" col-span-1 lg:col-span-1 text-[12px] text-center">Position</div>
                                <div className=" col-span-1 lg:col-span-1 text-[12px] text-center">CTR (%)</div>
                            </div>

                            {/* Table Rows */}
                            {currentData.map((item, index) => (
                                <div
                                    key={index}
                                    className="grid grid-cols-12 gap-2 py-2 border-b text-[12px] text-gray-800 transition-all duration-200 hover:bg-slate-200"
                                >
                                    <div className="font-semibold px-2 col-span-7  lg:col-span-8 text-[12px]  ">
                                        {tabId === 3 ? countries.getName(item?.label, 'en') || item?.label : item?.label}
                                    </div>
                                    <div className=" text-blue-600 text-[12px] font-semibold  col-span-1 lg:col-span-1 text-center">{item.clicks}</div>
                                    <div className=" text-red-500 text-[12px] font-semibold   col-span-2 lg:col-span-1 text-center">{item.impressions}</div>
                                    <div className=" text-green-500 text-[12px] font-semibold col-span-1 lg:col-span-1 text-center">{item.position.toFixed(1)}</div>
                                    <div className=" text-yellow-500 text-[12px] font-semibold  col-span-1  lg:col-span-1 text-center">{item.ctr}</div>
                                </div>
                            ))}

                            {/* Pagination Controls */}
                            <div className="mt-6 flex items-center justify-between">
                                <div className="flex items-center space-x-1">
                                    <label htmlFor={`itemsPerPage-${tabId}`} className="text-xs font-medium text-gray-600">Rows per page:</label>
                                    <select
                                        id={`itemsPerPage-${tabId}`}
                                        value={itemsPerPage}
                                        onChange={(e) => handleItemsPerPageChange(tabId, e)}
                                        className="border border-gray-300 rounded-md p-1.5 text-xs bg-white hover:bg-gray-100 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        disabled={data.length <= 5}
                                    >
                                        {[5, 10, 15].map(size => (
                                            <option key={size} value={size} className="text-gray-700">{size}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm font-medium text-gray-400">{`${startItem}-${endItem} of ${data.length}`}</span>
                                    <button
                                        onClick={() => handlePageChange(tabId, currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`p-2 rounded-md transition-colors duration-300 ${currentPage === 1 ? 'text-slate-500 cursor-not-allowed' : 'text-slate-900 hover:bg-gray-100'}`}
                                    >
                                        <ChevronLeftIcon className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => handlePageChange(tabId, currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`p-2 rounded-md transition-colors duration-300 ${currentPage === totalPages ? 'text-slate-500 cursor-not-allowed' : 'text-slate-900 hover:bg-gray-100'}`}
                                    >
                                        <ChevronRightIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-gray-600">No data available.</div>
                )}
            </div>
        );
    };

    const renderContent = () => {
        switch (activeTab) {
            case 1:
                return renderTable(values?.query || [], 1);
            case 2:
                return renderTable(values?.page || [], 2);
            case 3:
                return renderTable(values?.country || [], 3);
            case 4:
                return renderTable(values?.device || [], 4);
            case 5:
                return renderTable(values?.search_appearance || [], 5);
            case 6:
                return renderTable(values?.date || [], 6);
            default:
                return null;
        }
    };

    return (
        <main>
            <div className='mt-6 bg-warm'>
                {renderContent()}
            </div>
            <div>
                <LineChart values={values} />
            </div>
        </main>
    );
};

export default GoogleConsoleComponent;
