import React from 'react';
import { 
    FiSearch, 
    FiX,
    FiChevronDown,
    FiCheck
} from 'react-icons/fi';
import { 
    MdBrandingWatermark, 
    MdMemory, 
    MdComputer, 
    MdMoney, 
    MdSort, 
    MdHome
} from 'react-icons/md';
import { 
    SiAcer,
    SiLenovo,
    SiHp,
    SiAsus,
    SiDell,
    SiApple
} from 'react-icons/si';
import './FilterSidebar.css';

const FilterSidebar = ({
    tempFilters,
    handleTempFilterChange,
    toggleArrayFilter,
    handleApplyFilters,
    handleClearFilters,
    handleKeyPress,
    brands,
    ramOptions,
    processorOptions,
    activeFiltersCount
}) => {
    // State quản lý sections
    const [expandedSections, setExpandedSections] = React.useState({
        brand: true,
        ram: true,
        processor: true,
        price: true,
        sort: true
    });

    // Brand data với icons và counts
    const brandData = {
        'Acer': { icon: <SiAcer />, count: 5 },
        'Lenovo': { icon: <SiLenovo />, count: 10 },
        'HP': { icon: <SiHp />, count: 151 },
        'HP Dsus': { icon: <SiHp />, count: 10 },
        'Asus': { icon: <SiAsus />, count: 7 },
        'Dell': { icon: <SiDell />, count: 3 },
        'Apple': { icon: <SiApple />, count: 8 },
    };

    // RAM values cho slider
    const ramValues = ['4GB', '8GB', '16GB', '32GB', '34GB', '64GB'];
    const cpuValues = ['Intel Core i5', 'Intel Core i7', 'AMD Ryzen 7', 'AMD Ryzen 9'];

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    // Get RAM index từ filter value
    const getRamIndex = () => {
        if (!tempFilters.rams || tempFilters.rams.length === 0) return 2; // Default 16GB
        const firstRam = tempFilters.rams[0];
        const index = ramValues.indexOf(firstRam);
        return index >= 0 ? index : 2;
    };

    // Get CPU index từ filter value
    const getCpuIndex = () => {
        if (!tempFilters.processors || tempFilters.processors.length === 0) return 1; // Default Core i7
        const firstCpu = tempFilters.processors[0];
        const index = cpuValues.indexOf(firstCpu);
        return index >= 0 ? index : 1;
    };

    // Handle RAM slider change
    const handleRamSliderChange = (e) => {
        const index = parseInt(e.target.value);
        const ramValue = ramValues[index];
        handleTempFilterChange('rams', [ramValue]);
    };

    // Handle CPU slider change
    const handleCpuSliderChange = (e) => {
        const index = parseInt(e.target.value);
        const cpuValue = cpuValues[index];
        handleTempFilterChange('processors', [cpuValue]);
    };

    return (
        <aside className="sidebar">
            <div className="filter-section-new">
                {/* Header */}
                <div className="filter-header-new">
                    <h3>
                        <FiSearch className="header-icon" />
                        SEARCH & FILTER
                    </h3>
                    {activeFiltersCount > 0 && (
                        <span className="active-filters-badge-new">
                            {activeFiltersCount}
                        </span>
                    )}
                </div>
                
                {/* Search Bar */}
                <div className="filter-group-new">
                    <div className="search-box-new">
                        <FiSearch className="search-icon" />
                        <input 
                            type="text" 
                            placeholder="Search laptops..."
                            value={tempFilters.search}
                            onChange={(e) => handleTempFilterChange('search', e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="search-input-new"
                        />
                        {tempFilters.search && (
                            <button 
                                className="clear-btn"
                                onClick={() => handleTempFilterChange('search', '')}
                            >
                                <FiX />
                            </button>
                        )}
                    </div>
                </div>

                {/* Brand Filter - Horizontal Scroll */}
                <div className="filter-group-new">
                    <div 
                        className="filter-group-header-new"
                        onClick={() => toggleSection('brand')}
                    >
                        <div className="header-left">
                            <MdBrandingWatermark className="section-icon" />
                            <span>BRAND</span>
                        </div>
                        <FiChevronDown className={`chevron-icon ${expandedSections.brand ? 'expanded' : ''}`} />
                    </div>
                    {expandedSections.brand && (
                        <div className="filter-brand-scroll-container">
                            <div className="filter-brand-list">
                                {brands.map(brand => {
                                    const data = brandData[brand] || { icon: <MdBrandingWatermark />, count: 0 };
                                    const isSelected = tempFilters.brands.includes(brand);
                                    return (
                                        <div 
                                            key={brand} 
                                            className={`brand-card ${isSelected ? 'selected' : ''}`}
                                            onClick={() => toggleArrayFilter('brands', brand)}
                                        >
                                            <div className="brand-icon-wrapper">
                                                {data.icon}
                                            </div>
                                            <div className="brand-info">
                                                <span className="brand-name">{brand}</span>
                                                <span className="brand-count">{data.count}</span>
                                            </div>
                                            {isSelected && (
                                                <div className="check-badge-new">
                                                    <FiCheck />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* RAM Filter - Slider */}
                <div className="filter-group-new">
                    <div 
                        className="filter-group-header-new"
                        onClick={() => toggleSection('ram')}
                    >
                        <div className="header-left">
                            <MdMemory className="section-icon" />
                            <span>RAM</span>
                        </div>
                        <FiChevronDown className={`chevron-icon ${expandedSections.ram ? 'expanded' : ''}`} />
                    </div>
                    {expandedSections.ram && (
                        <div className="filter-slider-container">
                            <div className="slider-labels">
                                {ramValues.map((value, index) => (
                                    <span key={index} className={getRamIndex() === index ? 'active' : ''}>
                                        {value}
                                    </span>
                                ))}
                            </div>
                            <div className="slider-wrapper">
                                <input 
                                    type="range" 
                                    min="0" 
                                    max={ramValues.length - 1}
                                    value={getRamIndex()}
                                    onChange={handleRamSliderChange}
                                    className="slider-input"
                                    style={{
                                        background: `linear-gradient(to right, #6366f1 0%, #8b5cf6 ${(getRamIndex() / (ramValues.length - 1)) * 100}%, #e5e7eb ${(getRamIndex() / (ramValues.length - 1)) * 100}%, #e5e7eb 100%)`
                                    }}
                                />
                            </div>
                            <div className="slider-value-display">
                                {tempFilters.rams && tempFilters.rams.length > 0 ? tempFilters.rams[0] : ramValues[2]}
                            </div>
                        </div>
                    )}
                </div>

                {/* CPU Filter - Slider */}
                <div className="filter-group-new">
                    <div 
                        className="filter-group-header-new"
                        onClick={() => toggleSection('processor')}
                    >
                        <div className="header-left">
                            <MdComputer className="section-icon" />
                            <span>CPU</span>
                        </div>
                        <FiChevronDown className={`chevron-icon ${expandedSections.processor ? 'expanded' : ''}`} />
                    </div>
                    {expandedSections.processor && (
                        <div className="filter-slider-container">
                            <div className="slider-labels cpu-labels">
                                {cpuValues.map((value, index) => (
                                    <span key={index} className={getCpuIndex() === index ? 'active' : ''}>
                                        {value}
                                    </span>
                                ))}
                            </div>
                            <div className="slider-wrapper">
                                <input 
                                    type="range" 
                                    min="0" 
                                    max={cpuValues.length - 1}
                                    value={getCpuIndex()}
                                    onChange={handleCpuSliderChange}
                                    className="slider-input"
                                    style={{
                                        background: `linear-gradient(to right, #6366f1 0%, #8b5cf6 ${(getCpuIndex() / (cpuValues.length - 1)) * 100}%, #e5e7eb ${(getCpuIndex() / (cpuValues.length - 1)) * 100}%, #e5e7eb 100%)`
                                    }}
                                />
                            </div>
                            <div className="slider-value-display">
                                {tempFilters.processors && tempFilters.processors.length > 0 ? tempFilters.processors[0] : cpuValues[1]}
                            </div>
                        </div>
                    )}
                </div>

                {/* Price Range - Range Slider */}
                <div className="filter-group-new">
                    <div 
                        className="filter-group-header-new"
                        onClick={() => toggleSection('price')}
                    >
                        <div className="header-left">
                            <MdMoney className="section-icon" />
                            <span>PRICE RANGE</span>
                        </div>
                        <FiChevronDown className={`chevron-icon ${expandedSections.price ? 'expanded' : ''}`} />
                    </div>
                    {expandedSections.price && (
                        <div className="filter-price-container">
                            <div className="price-inputs-new">
                                <div className="price-input-wrapper">
                                    <label>FROM</label>
                                    <input 
                                        type="text" 
                                        placeholder="7,000,000đ"
                                        value={tempFilters.minPrice ? `${parseInt(tempFilters.minPrice).toLocaleString()}đ` : ''}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/[^\d]/g, '');
                                            handleTempFilterChange('minPrice', value);
                                        }}
                                        onKeyPress={handleKeyPress}
                                    />
                                </div>
                                <div className="price-input-wrapper">
                                    <label>TO</label>
                                    <input 
                                        type="text" 
                                        placeholder="Select criteria"
                                        value={tempFilters.maxPrice ? `${parseInt(tempFilters.maxPrice).toLocaleString()}đ` : ''}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/[^\d]/g, '');
                                            handleTempFilterChange('maxPrice', value);
                                        }}
                                        onKeyPress={handleKeyPress}
                                    />
                                    <FiChevronDown className="dropdown-icon-new" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* In Stock Checkbox */}
                <div className="filter-group-new checkbox-group-new">
                    <label className="checkbox-label-new">
                        <input 
                            type="checkbox" 
                            checked={tempFilters.inStock}
                            onChange={(e) => handleTempFilterChange('inStock', e.target.checked)}
                        />
                        <MdHome className="checkbox-icon-new" />
                        <span>Only show in-stock products</span>
                    </label>
                </div>

                {/* Sort By - Dropdown */}
                <div className="filter-group-new">
                    <div 
                        className="filter-group-header-new"
                        onClick={() => toggleSection('sort')}
                    >
                        <div className="header-left">
                            <MdSort className="section-icon" />
                            <span>SORT BY</span>
                        </div>
                        <FiChevronDown className={`chevron-icon ${expandedSections.sort ? 'expanded' : ''}`} />
                    </div>
                    {expandedSections.sort && (
                        <select 
                            value={tempFilters.sortBy} 
                            onChange={(e) => handleTempFilterChange('sortBy', e.target.value)}
                            className="sort-select-new"
                        >
                            <option value="">Newest</option>
                            <option value="price_asc">Price: Low to High</option>
                            <option value="price_desc">Price: High to Low</option>
                            <option value="popularity">Most Popular</option>
                        </select>
                    )}
                </div>

            </div>
            
            {/* Action Buttons - Fixed Outside Scroll */}
            <div className="filter-actions-fixed">
                <button 
                    className="apply-btn-new"
                    onClick={handleApplyFilters}
                >
                    <FiCheck /> APPLY
                </button>

                <button 
                    className="clear-btn-new"
                    onClick={handleClearFilters}
                >
                    <FiX /> CLEAR
                </button>
            </div>
        </aside>
    );
};

export default FilterSidebar;
