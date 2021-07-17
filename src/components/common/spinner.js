import React from 'react';
import { css } from "@emotion/react";
import BarLoader from "react-spinners/BarLoader";

const override = css`
  display: block;
  margin: 0 auto;
  /* border-color: #0a8e01; */
`;

export default function Spinner() {
    // const loading = props.loading;
    return (
        <div>
            <BarLoader
                color="#198754"
                loading={true}
                css={override}
                width={150}
                height={7}
                speedMultiplier={1}
            />
        </div>
    )
}
