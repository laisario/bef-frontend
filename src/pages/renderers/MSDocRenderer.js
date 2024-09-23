import React from "react";

import { Container, IFrame } from './GoogleRenderer'

const MSDocRenderer = ({ mainState: { currentDocument } }) => {
    if (!currentDocument) return null;

    return (
        <Container id="msdoc-renderer">
            <IFrame
                id="msdoc-iframe"
                title="msdoc-iframe"
                src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
                    currentDocument.uri,
                  )}`}
                frameBorder="0"
            />
        </Container>
    );
};

export default MSDocRenderer;

const MSDocFTMaps = {
    xls: ["xls", "application/vnd.ms-excel"],
    xlsm: ["xlsm", "application/vnd.ms-excel"],
    xlsx: [
        "xlsx",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ],
};

MSDocRenderer.fileTypes = [
    ...MSDocFTMaps.xls,
    ...MSDocFTMaps.xlsx,
    ...MSDocFTMaps.xlsm,
];
MSDocRenderer.weight = 0;
MSDocRenderer.fileLoader = ({ fileLoaderComplete }) => fileLoaderComplete();
