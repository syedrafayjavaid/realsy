import React from 'react';
import {act, render, screen} from "@testing-library/react";
import {Loader} from "./loader";
import '@testing-library/jest-dom';

describe ('Loader Component', () => {
    it ('renders only after the given delay', async () => {
        render(<Loader delay={100}/>);
        expect(screen.queryByRole(Loader.defaultProps?.role!)).not.toBeInTheDocument();
        await act(async () => await new Promise(resolve => setTimeout(resolve, 101)));
        expect(screen.getByRole(Loader.defaultProps?.role!)).toBeVisible();
    });

    it ('can render with a label', () => {
        const testLabel = 'Fake label...';
        render(<Loader delay={0} label={testLabel}/>);
        expect(screen.getByText(testLabel)).toBeVisible();
    });
});
