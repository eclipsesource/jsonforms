import Component from 'inferno-component';
export interface RatingState {
    rating: number;
    hoverAt: number | null;
}
export interface RatingProps {
    onClick: any;
    value: number;
}
export declare class Rating extends Component<RatingProps, RatingState> {
    constructor(props: any);
    handleMouseOver(idx: any): void;
    handleMouseOut(): void;
    handleClick(idx: any): void;
    render(): any;
}
