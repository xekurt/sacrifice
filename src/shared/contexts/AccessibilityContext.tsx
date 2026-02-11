import React, { createContext, useContext, useState, useEffect } from 'react';

export type ColorblindMode = 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';

interface AccessibilityContextType {
    colorblindMode: ColorblindMode;
    setColorblindMode: (mode: ColorblindMode) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [colorblindMode, setColorblindMode] = useState<ColorblindMode>(() => {
        return (localStorage.getItem('colorblindMode') as ColorblindMode) || 'none';
    });

    useEffect(() => {
        document.body.setAttribute('data-colorblind-theme', colorblindMode);
        localStorage.setItem('colorblindMode', colorblindMode);
    }, [colorblindMode]);

    return (
        <AccessibilityContext.Provider value={{ colorblindMode, setColorblindMode }}>
            {children}
        </AccessibilityContext.Provider>
    );
};

export const useAccessibility = () => {
    const context = useContext(AccessibilityContext);
    if (context === undefined) {
        throw new Error('useAccessibility must be used within an AccessibilityProvider');
    }
    return context;
};
