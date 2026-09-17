import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  PrivacyBody,
  TermsBody,
  PRIVACY_TITLE,
  TERMS_TITLE,
} from "@/components/legal/LegalContent";

export type LegalDoc = "privacy" | "terms";

interface LegalModalProps {
  doc: LegalDoc | null;
  onOpenChange: (open: boolean) => void;
}

// Renders the Privacy or Terms copy in an overlay so it can be opened from the
// signup form without navigating away and losing the in-progress form state.
export const LegalModal = ({ doc, onOpenChange }: LegalModalProps) => {
  const title = doc === "terms" ? TERMS_TITLE : PRIVACY_TITLE;

  return (
    <Dialog open={doc !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{title}</DialogTitle>
        </DialogHeader>
        {doc === "terms" ? <TermsBody /> : doc === "privacy" ? <PrivacyBody /> : null}
      </DialogContent>
    </Dialog>
  );
};
