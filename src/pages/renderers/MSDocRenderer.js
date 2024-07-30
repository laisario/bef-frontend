import React from "react";
import styled from "styled-components";

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
    ppt: ["ppt", "application/vnd.ms-powerpoint"],
    pptx: [
        "pptx",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ],
};

MSDocRenderer.fileTypes = [
    ...MSDocFTMaps.xls,
    ...MSDocFTMaps.xlsx,
    ...MSDocFTMaps.xlsm,
    ...MSDocFTMaps.ppt,
    ...MSDocFTMaps.pptx,
];
MSDocRenderer.weight = 0;
MSDocRenderer.fileLoader = ({ fileLoaderComplete }) => fileLoaderComplete();

const Container = styled.div`
  width: 100%;
`;
const IFrame = styled.iframe`
  width: 100%;
  height: 100%;
  border: 0;
`;