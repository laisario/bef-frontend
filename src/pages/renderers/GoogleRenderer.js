import React from "react";
import styled from "styled-components";

const GoogleRenderer = ({ mainState: { currentDocument } }) => {
    if (!currentDocument) return null;

    return (
        <Container id="Google-renderer">
            <IFrame
                id="Google-iframe"
                title="Google-iframe"
                src={`https://docs.google.com/gview?embedded=true&hl=pt-BR&url=${encodeURIComponent(
                    currentDocument.uri,
                )}`}
                frameBorder="0"
            />
        </Container>
    );
};

export default GoogleRenderer;

const GoogleFTMaps = {
    odt: ["odt", "application/vnd.oasis.opendocument.text"],
    doc: ["doc", "application/msword"],
    docx: [
        "docx",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/octet-stream",
    ],
    ppt: ["ppt", "application/vnd.ms-powerpoint"],
    pptx: [
        "pptx",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ],
};

GoogleRenderer.fileTypes = [
    ...GoogleFTMaps.odt,
    ...GoogleFTMaps.doc,
    ...GoogleFTMaps.docx,
    ...GoogleFTMaps.ppt,
    ...GoogleFTMaps.pptx,
];
GoogleRenderer.weight = 0;
GoogleRenderer.fileLoader = ({ fileLoaderComplete }) => fileLoaderComplete();

const Container = styled.div`
  width: 100%;
`;
const IFrame = styled.iframe`
  width: 100%;
  height: 100%;
  border: 0;
`;