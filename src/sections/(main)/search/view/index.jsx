"use client"
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Performers from '@/sections/Performers';
import TopVideo from '@/sections/TopVideo';

const SearchPage = () => {

    const [results, setResults] = useState({ models: [], videos: [] });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const query = useSearchParams().get('query');
    const [searchQuery, setSearchQuery] = useState(query);

    useEffect(() => {
        const fetchResults = async () => {
            if (!searchQuery || searchQuery.trim()?.length <= 2) {
                setResults({ models: [], videos: [] });
                setError('');
                return;
            }
            setLoading(true);
            setError('');
            try {
                const response = await fetch(`/api/admin/search?query=${searchQuery}`);
                const data = await response.json();
                if (data.models.length === 0 && data.videos.length === 0) {
                    setError('No results found.');
                }
                setResults(data);
            } catch (error) {
                console.error("Error fetching search results:", error);
                setError('An error occurred while searching.');
            } finally {
                setLoading(false);
            }
        };

        const delayDebounceFn = setTimeout(() => {
            fetchResults();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

   
    return (
        <div className="py-20 max-lg-mb:px-4 min-h-screen bg-black">

            <input
                type="text"
                value={searchQuery || ''}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xl  md:text-xl p-3 max-lg-mb:text-[100%] font-satoshi uppercase font-bold w-full mt-12 max-w-[400px] flex justify-center mx-auto bg-black text-white border border-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                placeholder="Search for models or videos"
            />
            <div className='mb-3 lg:mt-12 lg:mb-6 flex flex-col gap-y-8 '>
                {(results?.videos.length > 0 || results?.models.length > 0) && (
                    <h1 className="text-[22px] lg:text-[30px] uppercase text-white mt-8 font-gambetta leading-[22px] font-semibold text-center"
                    >Search Results for : {searchQuery}</h1>
                )}
                {
                 searchQuery &&   searchQuery.length > 2 && results?.models.length === 0 && results?.videos.length === 0 ?
                        <h3 className="text-[16px]  text-center uppercase text-white leading-[22px] font-normal">
                            No results found.
                        </h3>
                        : <h3 className="text-[16px] mt-4  text-center uppercase text-white leading-[22px] font-normal">
                            This is where you can browse videos / photos.
                        </h3>
                }
            </div>
            {results?.videos.length > 0 && (
                <TopVideo
                    title={"Videos"}
                    query={query}
                    videos={results?.videos}
                />
            )}
            {results?.models.length > 0 && (
                <Performers
                    title="Models"
                    query={query}
                    items={results?.models || []}
                />
            )}
        </div>
    );
};

export default SearchPage;